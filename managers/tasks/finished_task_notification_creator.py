from common.logger import log


@log
class NotificationCreator:
    def __init__(self, queue):
        self.queue = queue

    def finished(self, task):
        self.logger.info(
            "{} {} finished, {}".format(
                task.task_id,
                task.task_type,
                task.text
            )
        )

        if task.task_type == "dirsearch":
            self.dirsearch_finished(task)
        elif task.task_type == "masscan" or task.task_type == "nmap":
            self.masscan_finished(task)
        elif task.task_type == "dnsscan":
            self.dnsscan_finished(task)
        elif task.task_type == "patator":
            self.patator_finished(task)

    def dirsearch_finished(self, task):
        self.queue.put(
            ("file", task.target, task.project_uuid, task.text, task.task_type, task.status)
        )

    def masscan_finished(self, task):
        self.queue.put(
            ("scan", task.target, task.project_uuid, task.text, task.task_type, task.status)
        )

    def dnsscan_finished(self, task):
        self.queue.put(
            ("scope", task.target, task.project_uuid, None, task.task_type, task.status)
        )

    def patator_finished(self, task):
        self.queue.put(
            ("creds", task.target, task.project_uuid, None, task.task_type, task.status)
        )
    