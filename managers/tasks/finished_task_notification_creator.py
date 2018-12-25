from common.logger import log


@log
class NotificationCreator:
    def __init__(self, queue):
        self.queue = queue

    def notify(self, task):
        self.logger.info(
            "{} {} notify, {}".format(
                task.task_id,
                task.task_type,
                task.text
            )
        )

        if task.task_type == "dirsearch":
            self.dirsearch_notify(task)
        elif task.task_type == "masscan" or task.task_type == "nmap":
            self.masscan_notify(task)
        elif task.task_type == "dnsscan":
            self.dnsscan_notify(task)
        elif task.task_type == "patator":
            self.patator_notify(task)

    def dirsearch_notify(self, task):
        self.queue.put(
            ("file", task.target, task.project_uuid, task.text, task.task_type, task.status)
        )

    def masscan_notify(self, task):
        self.queue.put(
            ("scan", task.target, task.project_uuid, task.text, task.task_type, task.status)
        )

    def dnsscan_notify(self, task):
        self.queue.put(
            ("scope", task.target, task.project_uuid, None, task.task_type, task.status)
        )

    def patator_notify(self, task):
        self.queue.put(
            ("creds", task.target, task.project_uuid, None, task.task_type, task.status)
        )
    