""" DirsearchTask, that's it """
from black.workers.common.sync_task import SyncTask
from .dirsearch_ext.dirsearch import Program


class DirsearchTask(SyncTask):
    """ Instance of running dirsearch """

    def __init__(self, task_id, target, params, project_uuid):
        print("DirsearchTask.__init__", task_id)
        SyncTask.__init__(self, task_id, 'dirsearch', target, params, project_uuid)

        program_params = params['program']
        self.params_object = program_params

    def start(self):
        """ Launch the task and readers of stdout, stderr """
        try:
            print("Starting {}".format(self.target[0]))
            Program(self.target[0], self.task_id, self.project_uuid, self.set_status, self.params_object)
        except Exception as e:
            print("Aborted", e, str(e), self.target[0])
            self.set_status("Aborted", progress=0)

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
