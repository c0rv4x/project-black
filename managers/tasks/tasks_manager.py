""" This module contains functionality
that is responsible for managing tasks """
import uuid
import asyncio
import json
import aio_pika
from  aio_pika.exceptions import QueueEmpty

from black.db import Sessions, TaskDatabase
from managers.tasks.shadow_task import ShadowTask
from managers.tasks.task_spawner import TaskSpawner
from managers.tasks.tasks_cache import TasksCache
from managers.tasks.finished_task_notification_creator import NotificationCreator

from common.logger import log
from config import CONFIG


@log
class TaskManager(object):
    """ TaskManager keeps track of all tasks in the system,
    exposing some interfaces for public use. """

    def __init__(self, data_updated_queue, scope_manager):
        self.notification_creator = NotificationCreator(data_updated_queue)

        self.scope_manager = scope_manager

        self.cache = TasksCache()

        self.exchange = None
        self.tasks_queue = None

        self.sessions = Sessions()

    async def spawn_asynqp(self):
        """ Spawns all the necessary queues and launches a statuses parser """
        connection = await aio_pika.connect_robust(
            "amqp://{}:{}@{}:{}/".format(
                CONFIG['rabbit']['username'],
                CONFIG['rabbit']['password'],
                CONFIG['rabbit']['host'],
                CONFIG['rabbit']['port']
            ), loop=asyncio.get_event_loop()
        )

        # Open a communications channel
        channel = await connection.channel()

        # Create an exchange on the broker
        self.exchange = await channel.declare_exchange(
            'tasks.exchange',
            durable=True
        )

        # Create queues on the exchange
        self.tasks_queue = await channel.declare_queue(
            'tasks_statuses',
            durable=True
        )
        await self.tasks_queue.bind(
            self.exchange,
            routing_key='tasks_statuses'
        )

        for task_type in ['nmap', 'dnsscan', 'dirserach', 'masscan']:
            queue = await channel.declare_queue(
                task_type + '_tasks',
                durable=True
            )
            await queue.bind(self.exchange, task_type + '_tasks')

            await self.tasks_queue.consume(self.handle_status_message)
            # try:
            #     message = await self.tasks_queue.get()
            #     self.handle_status_message(message)
            # except QueueEmpty:
            #     pass

    def handle_status_message(self, message):
        """ Parse the message from the queue, which contains task status.
        Updates the relevant ShadowTask and, we notify the upper module that
        it must update the scan results. """
        body = json.loads(message.body)
        
        updated_task = self.cache.update_task(body)
        if updated_task and updated_task.quitted():
            self.notification_creator.notify(updated_task)

        message.ack()

    def get_tasks(self, project_uuid, only_fresh=False):
        if only_fresh:
            active = self.cache.get_fresh_active(project_uuid, update_fresh=True)
            finished = self.cache.get_fresh_finished(project_uuid, update_fresh=True)

        else:
            active = self.cache.get_active(project_uuid)
            finished = self.cache.get_finished(project_uuid)

        return {
            'active': list(map(
                lambda task: task.to_dict(),
                active
            )),
            'finished': list(map(
                lambda task: task.to_dict(),
                finished
            )),
        }

    def create_task(self, task_type, filters, params, project_uuid):
        """ Register the task and send a command to start it """
        if task_type == 'masscan':
            targets = self.scope_manager.get_ips(
                filters,
                project_uuid
            )

            tasks = TaskSpawner.start_masscan(
                targets, params, project_uuid
            )

        elif task_type == 'nmap':
            targets = self.scope_manager.get_ips(
                filters,
                project_uuid
            )

            tasks = TaskSpawner.start_nmap(
                targets, params, project_uuid
            )


        elif task_type == 'nmap_open':
            targets = self.scope_manager.get_ips_with_ports(
                filters,
                project_uuid
            )['ips']

            tasks = TaskSpawner.start_nmap_only_open(
                targets, params, project_uuid
            )

        elif task_type == 'dirsearch':
            if params['targets'] == 'ips':
                if filters.get('port', None):
                    filters['port'].append('%')
                else:
                    filters['port'] = ['%']

                targets = self.scope_manager.get_ips_with_ports(filters, project_uuid)
            else:
                targets = self.scope_manager.get_hosts_with_ports(
                    filters, project_uuid
                )

            tasks = TaskSpawner.start_dirsearch(
                targets, params, project_uuid
            )

        elif task_type == 'patator':
            if params['targets'] == 'ips':
                if filters.get('port', None) is None:
                    filters['port'] = ['%']

                targets = self.scope_manager.get_ips_with_ports(filters, project_uuid)
            else:
                targets = self.scope_manager.get_hosts_with_ports(
                    filters, project_uuid
                )

            tasks = TaskSpawner.start_patator(
                targets, params, project_uuid
            )

        elif task_type == 'amass':
            targets = params['program']['hosts'].strip().split('\n')

            if params['program']['all_top_level_domains']:
                all_hosts_db = self.scope_manager.get_hosts_with_ports({}, project_uuid)
                all_hosts = list(map(lambda host: host['hostname'], all_hosts_db['hosts']))

                top_level_hosts = set()

                for host in all_hosts:
                    top_level_hosts.add('.'.join(host.split('.')[-2:]))

                targets += list(top_level_hosts)

            targets = list(filter(lambda x: x, set(targets)))

            tasks = TaskSpawner.start_amass(
                targets, params, project_uuid
            )

        self.cache.add_tasks(tasks)

        for task in tasks:
            self.launch_task(task)

        return list(
            map(
                lambda task: task.to_dict(
                    grab_file_descriptors=False
                ),
                tasks
            )
        )

    def launch_task(self, task):
        """ Put a message to the queue, which says "start my task, please """
        print("Launching", task.task_type)
        asyncio.get_event_loop().create_task(self.exchange.publish(
            routing_key=task.task_type + "_tasks",
            message=aio_pika.Message(
                body=json.dumps({
                    'task_id': task.task_id,
                    'target': task.target,
                    'params': task.params,
                    'project_uuid': task.project_uuid
                }).encode()
            )
        ))
