import pika
import uuid

from black.black.db import sessions, Task


class ShadowTask(object):
    """ A shadow of the real task """
    def __init__(self, task_type, target, params, project_uuid):
        self.task_type = task_type
        self.target = target
        self.params = params
        self.project_uuid = project_uuid

        self.task_id = str(uuid.uuid4())

        self.channel = None

        """ Init variables """
        # connect to the RabbitMQ broker
        credentials = pika.PlainCredentials('guest', 'guest')
        parameters = pika.ConnectionParameters('localhost', credentials=credentials)
        connection = pika.BlockingConnection(parameters)

        # Open a communications channel
        self.channel = connection.channel()
        self.channel.exchange_declare(
            exchange="tasks.exchange",
            exchange_type="direct",
            durable=True)
        self.channel.queue_declare(queue=self.task_type + "_tasks", durable=True)
        self.channel.queue_bind(
            queue=self.task_type + "_tasks",
            exchange="tasks.exchange",
            routing_key=self.task_type + "_tasks") 


        self.status = None
        self.progress = None

    def set_status(self, new_status):
        self.status = new_status

    def set_progress(self, new_progress):
        self.progress = new_progress

    def get_status(self):
        return self.status

    def get_progress(self):
        return self.progress

    def commit_to_db(self):
        session = sessions.get_new_session()
        project_db = session.query(Task).filter_by(task_id=self.task_id).first()

        if project_db:
            project_db.status = self.status
            project_db.progress = self.progress
        else:
            new_project = Task(
                task_type=this.task_type,
                target=this.target,
                params=this.params,
                status=this.status,
                progress=this.progress,
                project_uuid=this.project_uuid)

            session.add(new_project)

        session.commit()
        sessions.destroy_session(session)     


class TaskManager(object):
    """ TaskManager keeps track of all tasks in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.active_tasks = list()
        self.finished_tasks = list()

        self.update_from_db()

    def update_from_db(self):
        """ Extract all the tasks from the DB """
        session = sessions.get_new_session()
        tasks_from_db = session.query(Task).all()
        
        tasks = list(map(lambda x: 
                ShadowTask(task_id,
                           task_type,
                           target,
                           params,
                           status,
                           project_uuid),
                     tasks_from_db))
        sessions.destroy_session(session)

        for task in tasks:
            if task.get_status() == 'Finished':
                self.finished_tasks.append(task)
            else:
                self.active_tasks.append(task)

    def get_tasks(self):
        return [self.active_tasks, self.finished_tasks]

    def create_task(self, task_type, target, params, project_uuid):
        task = ShadowTask(task_type, target, params, project_uuid)
        self.active_tasks.append(task)
