""" Basic class for Task (the isntance of a running scan
against 1 target) """
from black.db import sessions, models


class Task(object):
    """ Base class for the task """

    def __init__(self, task_id, task_type, target, params, project_name):
        # ID returned from the queue
        self.task_id = task_id

        # Name of the task (nmap, dnsscan ...)
        self.task_type = task_type

        # Target of the task
        self.target = target

        # Special parameters
        self.params = params

        # Project, on which the task has been launched
        self.project_name = project_name

        # Point to the object of ORM
        self.db_object = None
        # self.create_db_record()

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

        session = sessions.get_new_session()
        self.db_object.status = new_status
        session.add(self.db_object)
        session.commit()
        sessions.destroy_session(session)

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
        session = sessions.get_new_session()

        self.db_object = models.Task(
            task_id=self.task_id,
            task_type=self.task_type,
            target=str(self.target),
            params=str(self.params),
            project_name=self.project_name)

        session.add(self.db_object)
        session.commit()
        sessions.destroy_session(session)

        self.set_status("New")
