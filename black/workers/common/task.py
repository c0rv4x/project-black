""" Basic class for Task (the isntance of a running scan
against 1 target) """
from black.db import sessions, Task


class Task(object):
    """ Base class for the task """

    def __init__(self, task_id, command, project_name):
        # ID returned from the queue
        self.task_id = task_id

        # Point to the object of ORM
        self.db_object = None
        self.create_db_record()

        # Command, just for the record
        self.command = command
        self.project_name = project_name
        self.set_status("New")

        # Points the the asyncio.Process object 
        #   (if the task is launched via Popen)
        # Otherwise nothing
        self.proc = None

        # Keep track of the data
        self.stdout = None
        self.stderr = None
        self.exit_code = None

    def get_id(self):
        """ Return the id of the current task """
        return self.task_id

    def set_status(self, new_status):
        """ Change the status of the current task """
        self.status = new_status

    def get_status(self):
        """ Return the status of the current task """
        return self.status

    async def start(self):
        """ Launch the task """
        pass

    def send_notification(self, command):
        """ Sends 'command' notification to the current process """
        pass

    async def check_if_exited(self):
        """ Check if the process exited. If so,
        save stdout, stderr, exit_code and update the status """
        pass

    def create_db_record(self):
        """ Creates the record of the task in a special DB table """
        # self.db_object = Task(
        #     task_id=self.task_id),
        #     task_type=task_type)
        pass