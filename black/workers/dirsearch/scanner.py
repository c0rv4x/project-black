""" Class that performs scanning for files """
import uuid
import asyncio
from urllib.parse import urlparse

from .requester import Requester
from black.db import FoundFile, sessions


class Scanner(object):
    def __init__(self, base_url, task_id, project_uuid, cookies=None, headers=None):
        self.task_id = task_id
        self.project_uuid = project_uuid
        self.urls_queue = asyncio.Queue()

        self.requester = Requester(cookies=cookies, headers=headers)
        self.fill_queue(base_url)

    def save_callback(self, future):
        if not future.exception():
            url = future.url
            result = future.result()
            status_code = result[0]
            print(url,status_code)

            if status_code != 404:
                print("Found file")
                print(url)
                content_length = result[1]

                parsed_url = urlparse(url)
                scheme = parsed_url.scheme
                target = parsed_url.netloc

                if scheme == 'https':
                    port_number = 443
                else:
                    port_number = 80

                file_name = parsed_url.path

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


    def fill_queue(self, url):
        list_of_files = ["search", "2", "3"]

        for each_file in list_of_files:
            self.urls_queue.put_nowait(url + each_file)


    async def scan(self):
        finished = False

        while not finished:
            futures = []

            # This is done for possible recursive work
            while not self.urls_queue.empty():
                url = await self.urls_queue.get()
                request = asyncio.ensure_future(self.requester.perform_request(url))
                request.url = url
                request.add_done_callback(self.save_callback)

                futures.append(request)

            await asyncio.wait(futures)
            # Some data could appear in the queue (the recursive one)
            if self.urls_queue.empty():
                finished = True

        self.requester.destructor()
