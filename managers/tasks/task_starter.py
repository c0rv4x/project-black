import copy
import asynqp

from black.db import Sessions, IPDatabase
from managers.tasks.shadow_task import ShadowTask


class TaskStarter(object):
    """ Starts masscan task """
    def __init__(self, exchange):
        self.exchange = exchange

    def start(self, task):
        self.exchange.publish(
            routing_key=task.task_type + "_tasks",
            message=asynqp.Message(
                {
                    'task_id': task.task_id,
                    'target': task.target,
                    'params': task.params,
                    'project_uuid': task.project_uuid
                }
            )
        )

    def start_masscan(self, targets, params, project_uuid, exchange):
        tasks = []

        for i in range(0, len(targets) // 100 + 1):
            tasks.append(
                ShadowTask(
                    task_id=None,
                    task_type='masscan',
                    target=targets[i * 100:(i + 1) * 100],
                    params=params,
                    project_uuid=project_uuid
                )
            )

        for task in tasks:
            self.start(task)

        return tasks

    def start_nmap(self, targets, params, project_uuid, exchange):
        tasks = []

        for ip in targets:
            local_params = copy.deepcopy(params)
            local_params["saver"] = {}

            tasks.append(
                ShadowTask(
                    task_id=None,
                    task_type='nmap',
                    target=ip,
                    params=local_params,
                    project_uuid=project_uuid
                )
            )

        for task in tasks:
            self.start(task)

        return tasks

    def start_nmap_only_open(self, targets, params, project_uuid, exchange):
        tasks = []

        for ip in targets:
            local_params = copy.deepcopy(params)
            local_params["saver"] = {
                "scans_ids": []
            }

            local_params["special"] = []

            ports = []

            for each_port in ip["scans"]:
                ports.append(str(each_port["port_number"]))
                local_params["saver"]["scans_ids"].append({
                    "port_number": each_port["port_number"],
                    "scan_id": each_port["scan_id"]
                })

            local_params['special'].append('-p{}'.format(','.join(ports)))
            print("local_params", local_params)

            tasks.append(
                ShadowTask(
                    task_id=None,
                    task_type='nmap',
                    target=ip['ip_address'],
                    params=local_params,
                    project_uuid=project_uuid
                )
            )

        for task in tasks:
            self.start(task)

        return tasks

    def start_dirsearch(self, targets, params, project_uuid, exchange):
        tasks = []

        if 'ips' in targets.keys():
            ips = targets['ips']

            for each_ip in ips:
                for each_port in each_ip['scans']:
                    tasks.append(
                        ShadowTask(
                            task_id=None,
                            task_type='dirsearch',
                            target=(
                                each_ip['ip_address'] +
                                ':' +
                                str(each_port['port_number'])
                            ),
                            params=params,
                            project_uuid=project_uuid
                        )
                    )                
        else:
            hosts = targets['hosts']

            for each_host in hosts:
                ports = set()

                for each_ip in each_host['ip_addresses']:
                    for each_port in each_ip['scans']:
                        ports.add(each_port['port_number'])

                for each_port in ports:
                    tasks.append(
                        ShadowTask(
                            task_id=None,
                            task_type='dirsearch',
                            target=(
                                '{}:{}'.format(
                                    each_host['hostname'], str(each_port)
                                )
                            ),
                            params=params,
                            project_uuid=project_uuid
                        )
                    )

        for task in tasks:
            self.start(task)

        return tasks

    def start_patator(self, targets, params, project_uuid, exchange):
        tasks = []

        if 'ips' in targets.keys():
            ips = targets['ips']

            for each_ip in ips:
                for each_port in each_ip['scans']:
                    tasks.append(
                        ShadowTask(
                            task_id=None,
                            task_type='patator',
                            target=(
                                each_ip['ip_address'] +
                                ':' +
                                str(each_port['port_number'])
                            ),
                            params=params,
                            project_uuid=project_uuid
                        )
                    )                
        else:
            hosts = targets['hosts']

            for each_host in hosts:
                ports = set()

                for each_ip in each_host['ip_addresses']:
                    for each_port in each_ip['scans']:
                        ports.add(each_port['port_number'])

                for each_port in ports:
                    tasks.append(
                        ShadowTask(
                            task_id=None,
                            task_type='patator',
                            target=(
                                '{}:{}'.format(
                                    each_host['hostname'], str(each_port)
                                )
                            ),
                            params=params,
                            project_uuid=project_uuid
                        )
                    )

        for task in tasks:
            self.start(task)

        return tasks
