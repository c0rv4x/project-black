""" This module contains functionality, that is responsible for managing tasks """
import uuid
import asyncio
import json
import asynqp

from black.black.db import Sessions, TaskDatabase
from managers.tasks.shadow_task import ShadowTask
from managers.tasks.task_starter import TaskStarter


class TaskManager(object):
    """ TaskManager keeps track of all tasks in the system,
    exposing some interfaces for public use. """

    def __init__(self, data_updated_queue, scope_manager):
        self.data_updated_queue = data_updated_queue
        self.scope_manager = scope_manager

        self.active_tasks = list()
        self.finished_tasks = list()

        self.exchange = None
        self.tasks_queue = None

        self.sessions = Sessions()

        self.update_from_db()

    async def spawn_asynqp(self):
        """ Spawns all the necessary queues and launches a statuses parser """
        # connect to the RabbitMQ broker
        connection = await asynqp.connect('localhost', 5672, username='guest', password='guest')

        # Open a communications channel
        channel = await connection.open_channel()

        # Create an exchange on the broker
        self.exchange = await channel.declare_exchange('tasks.exchange', 'direct')

        # Create queues on the exchange
        self.tasks_queue = await channel.declare_queue('tasks_statuses')
        await self.tasks_queue.bind(self.exchange, routing_key='tasks_statuses')

        for task_type in ['nmap', 'dnsscan', 'dirseach', 'dnsscan']:
            queue = await channel.declare_queue(task_type + '_tasks', durable=True)
            await queue.bind(self.exchange, task_type + '_tasks')

        await self.tasks_queue.consume(self.parse_new_status)

    def check_finished_task_necessities(self, task):
        """ After the task finishes, we need to check, whether we should push
        some new changes to the front end """
        if task.task_type == "dirsearch":
            self.data_updated_queue.put(("file", task.project_uuid, task.text))
        elif task.task_type == "masscan" or task.task_type == "nmap":
            print("Finished task necessities", task.text)
            self.data_updated_queue.put(("scan", task.project_uuid, task.text))
        elif task.task_type == "dnsscan":
            self.data_updated_queue.put(("scope", task.project_uuid, None))

    def parse_new_status(self, message):
        """ Parse the message from the queue, which contains task status,
        updates the relevant ShadowTask and, we notify the upper module that
        it must update the scan results. """
        body = message.json()
        task_id = body['task_id']

        for task in self.active_tasks:
            if task.task_id == task_id:
                new_status = body['status']
                new_progress = body['progress']
                new_text = body['text']
                new_stdout = body['new_stdout']
                new_stderr = body['new_stderr']

                new_data = body.get('new_data', None)

                if new_status != task.status or new_progress != task.progress:
                    task.new_status_known = False

                task.set_status(new_status, new_progress, new_text, new_stdout, new_stderr)

                if new_data or new_status == 'Finished' or new_status == 'Aborted':
                    self.check_finished_task_necessities(task)                    

                if new_status == 'Finished' or new_status == 'Aborted':
                    self.active_tasks.remove(task)
                    self.finished_tasks.append(task)

                break

        message.ack()
        # channel.basic_ack(delivery_tag=method.delivery_tag)

    def update_from_db(self):
        """ Extract all the tasks from the DB """
        session = self.sessions.get_new_session()
        tasks_from_db = session.query(TaskDatabase).all()
        tasks = list(map(lambda x:
                         ShadowTask(task_id=x.task_id,
                                    task_type=x.task_type,
                                    target=json.loads(x.target),
                                    params=json.loads(x.params),
                                    project_uuid=x.project_uuid,
                                    status=x.status,
                                    progress=x.progress,
                                    text=x.text,
                                    date_added=x.date_added,
                                    stdout=x.stdout,
                                    stderr=x.stderr,
                                    exchange=self.exchange),
                         tasks_from_db))
        self.sessions.destroy_session(session)

        for task in tasks:
            status = task.get_status()[0]
            if status == 'Finished' or status == 'Aborted':
                self.finished_tasks.append(task)
            else:
                self.active_tasks.append(task)

    def get_tasks(self):
        """ Returns a list of active tasks and a list of finished tasks """
        return [self.active_tasks, self.finished_tasks]

    def get_tasks_native_objects(self, project_uuid=None, get_all=False):
        """ "Serializes" tasks to native python dicts """
        active_filtered = list(filter(
            lambda x: project_uuid is None or x.project_uuid == project_uuid,
            self.active_tasks))
        finished_filtered = list(filter(
            lambda x: project_uuid is None or x.project_uuid == project_uuid,
            self.finished_tasks))

        if get_all:
            active = list(map(lambda x: x.get_as_native_object(grab_file_descriptors=False), active_filtered))
            finished = list(map(lambda x: x.get_as_native_object(grab_file_descriptors=False), finished_filtered))

            return {
                'active': active,
                'finished': finished
            }

        active = list(filter(lambda x: x.new_status_known is False, active_filtered))
        finished = list(filter(lambda x: x.new_status_known is False, finished_filtered))

        for each_task in active:
            each_task.new_status_known = True

        for each_task in finished:
            each_task.new_status_known = True

        active = list(map(lambda x: x.get_as_native_object(grab_file_descriptors=False), active))
        finished = list(map(lambda x: x.get_as_native_object(grab_file_descriptors=False), finished))

        return {
            'active': active, 
            'finished': finished
        }            


    def create_task(self, task_type, filters, params, project_uuid):
        """ Register the task and send a command to start it """
        if task_type == 'masscan':
            targets = self.scope_manager.get_ips(filters, project_uuid, ips_only=True)['ips']
            tasks = TaskStarter.start_masscan(targets, params, project_uuid, self.exchange)

            self.active_tasks += tasks

        elif task_type == 'nmap':
            targets = self.scope_manager.get_ips(filters, project_uuid)['ips']
            tasks = TaskStarter.start_nmap(targets, params, project_uuid, self.exchange)

            self.active_tasks += tasks

        elif task_type == 'dirsearch':
            if params['targets'] == 'ips':
                targets = self.scope_manager.get_ips(filters, project_uuid, ips_ports_only=True)
            else:
                targets = self.scope_manager.get_hosts(filters, project_uuid, hosts_only=True)

            tasks = TaskStarter.start_dirsearch(targets, params, project_uuid, self.exchange)
            self.active_tasks += tasks

        return list(map(lambda task: task.get_as_native_object(grab_file_descriptors=False), tasks))
