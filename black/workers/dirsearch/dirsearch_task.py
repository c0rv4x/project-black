""" DirsearchTask, that's it """
from black.workers.common.sync_task import SyncTask
from .dirsearch_ext.dirsearch import Program

from multiprocessing import Process, Queue
from threading import Thread


class DirsearchTask(SyncTask):
    """ Instance of running dirsearch """

    def __init__(self, task_id, target, params, project_uuid):
        SyncTask.__init__(
            self, task_id, 'dirsearch', target, params, project_uuid
        )

        program_params = params['program']
        self.params_object = program_params

        self.dirsearch_proc = None
        self.polling_thread = None

    def start(self):
        """ Launch the task and readers of stdout, stderr """
        try:
            print("Starting {}".format(self.target[0]))
            queue = Queue()
            self.start_background_process(queue)
        except Exception:
            self.set_status("Aborted", progress=0)

    def start_background_process(self, progress_queue):
        self.dirsearch_proc = Process(
            target=Program,
            args=(
                self.target[0], self.task_id, self.project_uuid,
                progress_queue, self.params_object
            )
        )

        self.dirsearch_proc.start()

        self.polling_thread = Thread(target=self.poll_status, args=(progress_queue,))
        self.polling_thread.start()

    def poll_status(self, progress_queue):
        while True:
            message = progress_queue.get()
            print(self.target, message['progress'], message['status'])
            status = message['status']
            self.set_status(status, progress=message['progress'])

            if status == 'Aborted' or status == 'Finished':
                return

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
        self.dirsearch_proc.join()
        self.polling_thread.join()
