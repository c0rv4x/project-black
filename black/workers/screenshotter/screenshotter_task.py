""" Keeps class with the interfaces that are pulled by worker
to manager the launched instance of scan. """
from selenium import webdriver

from black.workers.common.task import Task
from .screenshot_maker import make_screenshot


class ScreenshotterTask(Task):
    """ Major class for working with selenium """

    def __init__(self, task_id, command):
        Task.__init__(self, task_id, command)
        self.status = "New"
        self.result = None

    def start(self):
        """ Launch the task and readers of stdout, stderr """
        self.status = "Working"
        print("Starting work")
        print(self.command)
        self.result = make_screenshot(self.command, "black/screenshots/" + self.task_id)
        print("Finished work")

    def send_notification(self, command):
        """ Sendms 'command' notification to the current process. """
        if command == 'pause':
            pass
        elif command == 'stop':
            pass
        elif command == 'unpause':
            pass

    def wait_for_exit(self):
        """ Check if the process exited. If so,
        save stdout, stderr, exit_code and update the status. """
        if self.result['success']:
            self.status = "Finished"
        else:
            self.status = "Aborted"
