import datetime


class ShadowTask(object):
    """ A shadow of the real task """

    def __init__(
        self,
        task_id,
        task_type,
        target,
        params,
        project_uuid,
        status="New",
        progress=None,
        text=None,
        date_added=datetime.datetime.utcnow(),
        stdout="",
        stderr="",
        exchange=None
    ):
        self.task_type = task_type
        self.target = target
        self.params = params
        self.project_uuid = project_uuid
        if task_id:
            self.task_id = task_id
        else:
            self.task_id = str(uuid.uuid4())

        self.status = status
        self.progress = progress
        self.text = text
        self.date_added = date_added
        self.stdout = stdout
        self.stderr = stderr

        self.exchange = exchange

        # This variable keeps information whether the corresponding task
        # should be sent back to the web.
        self.new_status_known = False

    def send_start_task(self):
        """ Put a message to the queue, which says "start my task, please """
        self.exchange.publish(
            routing_key=self.task_type + "_tasks",
            message=asynqp.Message(
                {
                    'task_id': self.task_id,
                    'target': self.target,
                    'params': self.params,
                    'project_uuid': self.project_uuid
                }
            )
        )

    def set_status(self, new_status, progress, text, new_stdout, new_stderr):
        """ Change status, progress and text of the task """
        self.status = new_status
        self.progress = progress
        self.text = text
        self.stdout += new_stdout
        self.stderr += new_stderr

    def get_status(self):
        """ Returns a tuple of status, progress and text of the task"""
        return (self.status, self.progress, self.text)

    def get_as_native_object(self, grab_file_descriptors=False):
        """ "Serialize" the task to python native dict """
        if grab_file_descriptors:
            if self.status == 'Finished' or self.status == 'Aborted':
                return {
                    "task_id": self.task_id,
                    "task_type": self.task_type,
                    "target": self.target,
                    "params": self.params,
                    "status": self.status,
                    "progress": self.progress,
                    "text": self.text,
                    "project_uuid": self.project_uuid,
                    "stdout": self.stdout,
                    "stderr": self.stderr,
                    "date_added": str(self.date_added)
                }

        return {
            "task_id": self.task_id,
            "task_type": self.task_type,
            "target": self.target,
            "params": self.params,
            "status": self.status,
            "progress": self.progress,
            "text": self.text,
            "project_uuid": self.project_uuid,
            # "stdout" : self.stdout,
            # "stderr" : self.stderr,
            "date_added": str(self.date_added)
        }
