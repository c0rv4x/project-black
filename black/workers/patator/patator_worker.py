""" Module that will accumulate all the tasks described """
import os

from black.db import Sessions, DictDatabase

from black.workers.patator.patator_task import PatatorTask
from black.workers.common.async_worker import AsyncWorker


class PatatorWorker(AsyncWorker):
    """ Name says for itself """
    def __init__(self):
        AsyncWorker.__init__(self, 'patator', PatatorTask)

    def fetch_ditionaries(self):
        session_spawner = Sessions()
        with session_spawner.get_session() as session:
            dicts_raw = (
                session.query(
                    DictDatabase
                ).filter(
                    DictDatabase.dict_type == self.name
                ).all()
            )
        
        dicts = list(map(lambda dictionary: dictionary.dict(), dicts_raw))
        wordlists_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'wordlists')
        existing_dicts = os.listdir(wordlists_path)

        for dictionary in dicts:
            name = dictionary["name"]
            if dictionary["name"] not in existing_dicts:
                with open(os.path.join(wordlists_path, name), "w") as w:
                    w.write(dictionary["content"])

    async def start(self):
        """ Start all the necessary consumers """
        self.fetch_ditionaries()
        await self.initialize(max_tasks=2)
        await self.start_tasks_consumer()
        await self.start_notifications_consumer()
