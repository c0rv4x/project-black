""" Basic class for Task (the isntance of a running scan
against 1 target) """


class Task(object):
    """ Base class for the task """

    def __init__(self, task_id, command):
        # ID returned from the queue
        self.task_id = task_id

        # Command, just for the record
        self.command = command
        self.status = "New"

        # Points the the asyncio.Process object
        self.proc = None

        # Keep track of the data
        self.stdout = None
        self.stderr = None
        self.exit_code = None

    def get_id(self):
        """ Return the id of the current task"""
        return self.task_id

    def get_status(self):
        """ Return the status of the current task"""
        return self.status

    async def start(self):
        """ Launch the task """
        pass

    def send_notification(self, command):
        """ Sends 'command' notification to the current process. """
        pass

    async def check_if_exited(self):
        """ Check if the process exited. If so,
        save stdout, stderr, exit_code and update the status. """
        pass
