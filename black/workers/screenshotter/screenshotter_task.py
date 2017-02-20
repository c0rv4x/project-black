""" Keeps class with the interfaces that are pulled by worker
to manager the launched instance of scan. """
import signal
from selenium import webdriver

from black.workers.common.task import Task


class ScreenshotterTask(Task):
    """ Major class for working with selenium """

    def __init__(self, task_id, command):
        Task.__init__(self, task_id, command)
        self.status = "New"

    def start(self):
        """ Launch the task and readers of stdout, stderr """
        self.status = "Working"

    def get_screenshot(self, site="https://github.com"):
        driver = webdriver.PhantomJS()
        driver.set_window_size(1024, 768) # set the window size that you need 
        driver.get(site)
        driver.save_screenshot('github.png')        

    def send_notification(self, command):
        """ Sends 'command' notification to the current process. """
        if command == 'pause':
            self.proc.send_signal(signal.SIGSTOP.value)  # SIGSTOP
        elif command == 'stop':
            self.proc.terminate()  # SIGTERM
        elif command == 'unpause':
            self.proc.send_signal(signal.SIGCONT.value)  # SIGCONT

    def wait_for_exit(self):
        """ Check if the process exited. If so,
        save stdout, stderr, exit_code and update the status. """
        print("Task started")

        if self.exit_code == 0:
            self.status = "Finished"
        else:
            self.status = "Aborted"
