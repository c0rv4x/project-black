import os
import asyncio
import aioredis
from time import sleep
from asyncio.subprocess import PIPE
from concurrent.futures._base import TimeoutError

from worker import Worker


class NmapWorker(Worker):
    def __init__(self):
        Worker.__init__(self, 'nmap')

    async def update_active_processes(self):
        """ Check all the running processes and see if any has finished(terminated) """
        # Remember, which processes should be removed from the list of active processes
        to_remove = list()

        for i in range(0, len(self.active_processes)):
            tag = self.active_processes[i]['tag']
            proc = self.active_processes[i]['process']
            try:
                # Give 0.1s for a check that a process has exited
                (stdout, stderr) = await asyncio.wait_for(proc.communicate(), 0.1)
            except TimeoutError as e:
                # Not yet finished
                print("[Task][Poll] Timeout")
            else:
                # The process have exited.
                # Grab the exit code of the process
                exit_code = await proc.wait()

                # For now leave these prints
                print("[Task][Poll] Finished")
                print(stdout, stderr)
                print(exit_code)

                # Save the data about the process, so we can grab it next time
                # or serialize and save locally
                self.finished_processes.append({
                    "tag": tag,
                    "stdout": stdout,
                    "stderr": stderr,
                    "exit_code": exit_code,
                    "status": "finished" if exit_code == 0 else "terminated"
                })
                to_remove.append(i)

        # Remove finished/terminated tasks from the list of active tasks
        if to_remove:
            for i in reversed(to_remove):
                self.active_processes.pop(i)

    async def start_task(self, message):
        """ Method launches the task execution, remembering the 
            processes's object. """

        # Add a unique tag to the task, so we can track the notifications 
        # which are addressed to the ceratin task
        print("[Task] Started")
        message = message[1]
        task_tag = message['tag']
        command = message['command']

        # Spawn the process
        proc = await asyncio.create_subprocess_shell(command,
                                                     stdout=PIPE, stderr=PIPE)

        # Store the object that points to the process
        self.active_processes.append({
            "tag": task_tag, 
            "process": proc,
            "command": command
        })
        # print("YEEEE LOGGER") 

    async def start_notification(self, message):
        """ Method launches the notification execution, remembering the 
            processes's object. """
        message = message[1]
        task_tag = message['tag']
        command = message['command']

        for pc_object in self.active_processes:
            tag = pc_object['tag']

            if tag == task_tag:
                pc = pc_object['process']
                print("Found process to send the notif")

                if command == 'pause':
                    print("[Notif] Pause")
                    pc.send_signal(19) # SIGSTOP
                    pc.send_signal(19) # SIGSTOP
                elif command == 'stop':
                    print("[Notif] Stop")
                    pc.terminate() # SIGTERM
                elif command == 'unpause':
                    print("[Notif] Unpause")
                    pc.send_signal(18) # SIGCONT
                    # pc.send_signal(18) # SIGCONT


loop = asyncio.get_event_loop()
nmap = NmapWorker()
loop.run_until_complete(nmap.initialize())
loop.run_until_complete(nmap.process_queues())
