""" DirsearchTask, that's it """
from black.workers.common.async_task import AsyncTask
from black.workers.dirsearch.scanner import Scanner


class DirsearchTask(AsyncTask):
    """ Instance of running dirsearch """

    def __init__(self, task_id, target, params, project_uuid):
        AsyncTask.__init__(self, task_id, 'dirsearch', target, params, project_uuid)

        cookies = params['program'][0].get('cookies', None)
        headers = params['program'][0].get('headers', None)

        self.scanner = Scanner(
            target,
            self.task_id,
            self.project_uuid,
            cookies=cookies,
            headers=headers)


    async def start(self):
        """ Launch the task and readers of stdout, stderr """
        await self.scanner.scan()


    def send_notification(self, command):
        """ Sends 'command' notification to the current process. """
        # if command == 'pause':
        #     self.proc.send_signal(signal.SIGSTOP.value)  # SIGSTOP
        # elif command == 'stop':
        #     self.proc.terminate()  # SIGTERM
        # elif command == 'unpause':
        #     self.proc.send_signal(signal.SIGCONT.value)  # SIGCONT

    async def wait_for_exit(self):
        """ Check if the process exited. If so,
        save stdout, stderr, exit_code and update the status. """
