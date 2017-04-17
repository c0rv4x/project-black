""" DirsearchTask, that's it """
from black.workers.common.sync_task import SyncTask
from .dirsearch_ext.dirsearch import Program


class DirsearchTask(SyncTask):
    """ Instance of running dirsearch """

    def __init__(self, task_id, target, params, project_uuid):
        SyncTask.__init__(self, task_id, 'dirsearch', target, params, project_uuid)

        cookies = params['program'][0].get('cookies', None)
        headers = params['program'][0].get('headers', None)


    def start(self):
        """ Launch the task and readers of stdout, stderr """
        a = Program('http://anatoly.tech', self.task_id, self.project_uuid)


    def send_notification(self, command):
        """ Sends 'command' notification to the current process. """
        # if command == 'pause':
        #     self.proc.send_signal(signal.SIGSTOP.value)  # SIGSTOP
        # elif command == 'stop':
        #     self.proc.terminate()  # SIGTERM
        # elif command == 'unpause':
        #     self.proc.send_signal(signal.SIGCONT.value)  # SIGCONT

    def wait_for_exit(self):
        """ Check if the process exited. If so,
        save stdout, stderr, exit_code and update the status. """
