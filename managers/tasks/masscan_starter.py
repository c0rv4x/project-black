from black.black.db import Sessions, IPDatabase
from managers.tasks.shadow_task import ShadowTask


class MasscanStarter(object):
    """ Starts masscan task """

    @staticmethod
    def start_task(targets, params, project_uuid, exchange):
        tasks = []

        for i in range(0, len(targets) // 100 + 1):
            print(targets)
        #     tasks.append(
        #         ShadowTask(task_id=None,
        #                    task_type='masscan',
        #                    target=targets[i * 100 : (i + 1) * 100],
        #                    params=params,
        #                    project_uuid=project_uuid,
        #                    exchange=exchange))

        # for task in tasks:
        #     task.send_start_task()

        return tasks