from black.black.db import Sessions, IPDatabase


class MasscanStarter(object):

    def __init__(self, filters, params, project_uuid, session_spawner):
        session = session_spawner.get_new_session()
        ips_from_db = session.query(IPDatabase).filter(
            IPDatabase.project_uuid == project_uuid
        )
