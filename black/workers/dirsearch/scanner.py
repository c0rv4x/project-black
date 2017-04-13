""" Class that performs scanning for files """
import uuid
import asyncio
from urllib.parse import urlparse

from black.db import FoundFile, sessions
from .requester import Requester


class Scanner(object):
    """ Class that works with requester in order to fully scan the website """
    def __init__(self, base_url, task_id, project_uuid, cookies=None, headers=None):
        self.task_id = task_id
        self.project_uuid = project_uuid
        self.urls_queue = asyncio.Queue()

        self.requester = Requester(base_url, cookies=cookies, headers=headers)
        self.fill_queue(base_url)

    def save_callback(self, future):
        """ Future's callback for saving to the DB """
        if not future.exception():
            file_name = future.file_name
            result = future.result()
            status_code = result[0]

            print(file_name, result)

            if status_code != 404:
                content_length = result[1]
                url = result[2]
                target = result[3]
                port_number = result[4]

                session = sessions.get_new_session()
                new_file = FoundFile(file_id=str(uuid.uuid4()),
                                     file_name=file_name,
                                     target=target,
                                     port_number=port_number,
                                     file_path=url,
                                     status_code=status_code,
                                     content_length=content_length,
                                     special_note=None,
                                     task_id=self.task_id,
                                     project_uuid=self.project_uuid)
                session.add(new_file)
                session.commit()

                sessions.destroy_session(session)


    def fill_queue(self):
        """ Getting the dictionary, create a queue of the requests """
        list_of_files = ["1.html", "2", "1.svg"]

        for each_file in list_of_files:
            self.urls_queue.put_nowait(each_file)


    async def scan(self):
        """ Launch the scanner """
        finished = False

        while not finished:
            futures = []

            # This is done for possible recursive work
            while not self.urls_queue.empty():
                file_name = await self.urls_queue.get()
                request = asyncio.ensure_future(self.requester.perform_request(file_name))
                request.file_name = file_name
                request.add_done_callback(self.save_callback)

                futures.append(request)

            await asyncio.wait(futures)
            # Some data could appear in the queue (the recursive one)
            if self.urls_queue.empty():
                finished = True

        self.requester.destructor()
