import copy
from black.black.db import Sessions, IPDatabase
from managers.tasks.shadow_task import ShadowTask


class TaskStarter(object):
    """ Starts masscan task """

    @staticmethod
    def start_masscan(targets, params, project_uuid, exchange):
        tasks = []

        for i in range(0, len(targets) // 100 + 1):
            tasks.append(
                ShadowTask(
                    task_id=None,
                    task_type='masscan',
                    target=','.join(targets[i * 100:(i + 1) * 100]),
                    params=params,
                    project_uuid=project_uuid,
                    exchange=exchange))

        for task in tasks:
            task.send_start_task()

        return tasks

    @staticmethod
    def start_nmap(targets, params, project_uuid, exchange):
        tasks = []

        for ip in targets:
            local_params = copy.deepcopy(params)
            local_params["saver"] = {
                "scans_ids": []
            }

            ports = []

            for each_port in ip["scans"]:
                ports.append(str(each_port["port_number"]))
                local_params["saver"]["scans_ids"].append({
                    "port_number": each_port["port_number"],
                    "scan_id": each_port["scan_id"]
                })

            local_params['program'].append('-p{}'.format(','.join(ports)))

            tasks.append(
                ShadowTask(
                    task_id=None,
                    task_type='nmap',
                    target=ip['ip_address'],
                    params=local_params,
                    project_uuid=project_uuid,
                    exchange=exchange))

        for task in tasks:
            task.send_start_task()

        return tasks

    @staticmethod
    def start_dirsearch(targets, params, project_uuid, exchange):
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
                            project_uuid=project_uuid,
                            exchange=exchange))                
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
                            project_uuid=project_uuid,
                            exchange=exchange))

        for task in tasks:
            task.send_start_task()

        return tasks
