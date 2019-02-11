""" Main application, running on sanic """
import os
import base64

import socketio
from sanic import Sanic, response
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from events_handling import Handlers

from common.logger import init_default
from config import CONFIG

from managers.meta_manager import MetaManager

from server.handlers.creds import CredsHandlers
from server.handlers.dictionaries import DictHandlers
from server.handlers.files import FilesHandlers
from server.handlers.ips import IPsHandlers
from server.handlers.hosts import HostsHandlers
from server.handlers.projects import ProjectsHandlers
from server.handlers.scans import ScansHandlers
from server.handlers.scopes import ScopesHandlers
from server.handlers.static import StaticHandlers
from server.handlers.tasks import TasksHandlers
from server.handlers.utils import authorized


if __name__ == '__main__':
    init_default()

    meta_manager = MetaManager()

    socketio = socketio.AsyncServer(async_mode='sanic')
    app = Sanic()

    socketio.attach(app)

    # Manage projects
    projects_handlers = ProjectsHandlers(meta_manager.project_manager, socketio)
    app.add_route(projects_handlers.cb_get_projects, '/projects')
    app.add_route(projects_handlers.cb_create_project, '/projects/create', methods=['POST'])
    app.add_route(projects_handlers.cb_delete_project, '/projects/delete', methods=['POST'])
    app.add_route(projects_handlers.cb_update_project, '/projects/update', methods=['POST'])

    # Handlers for scopes
    scopes_handlers = ScopesHandlers(meta_manager.scope_manager, socketio)
    app.add_route(scopes_handlers.cd_create_scopes, '/project/<project_uuid:int>/scopes', methods=['POST'])

    # Manager IPS
    ips_handlers = IPsHandlers(meta_manager.scope_manager, socketio)
    app.add_route(ips_handlers.cb_get_ips, '/project/<project_uuid:int>/ips')
    app.add_route(ips_handlers.cb_get_single_ip, '/project/<project_uuid:int>/ip/get/<ip_address>')
    app.add_route(ips_handlers.cb_update_comment, '/project/<project_uuid:int>/ip/update/<ip_id>', methods=['POST'])
    app.add_route(ips_handlers.cb_delete_ip, '/project/<project_uuid:int>/ip/delete', methods=['POST'])
    app.add_route(ips_handlers.cb_get_tasks_for_ips, '/project/<project_uuid:int>/ips/tasks', methods=['POST'])

    # Handlers for hosts
    hosts_handlers = HostsHandlers(meta_manager.scope_manager, socketio)
    app.add_route(hosts_handlers.cb_get_hosts, '/project/<project_uuid:int>/hosts')
    app.add_route(hosts_handlers.cb_get_single_host, '/project/<project_uuid:int>/host/get/<hostname>')
    app.add_route(hosts_handlers.cb_update_comment, '/project/<project_uuid:int>/host/update/<host_id>', methods=['POST'])
    app.add_route(hosts_handlers.cb_delete_host, '/project/<project_uuid:int>/host/delete', methods=['POST'])
    app.add_route(hosts_handlers.cb_get_tasks_for_hosts, '/project/<project_uuid:int>/hosts/tasks', methods=['POST'])

    # Handlers for creds
    creds_handlers = CredsHandlers(meta_manager.creds_manager)
    app.add_route(creds_handlers.cb_get_creds, '/project/<project_uuid:int>/creds', methods=['POST'])
    app.add_route(creds_handlers.cb_delete_creds, '/project/<project_uuid:int>/creds/delete')

    ## Handlers for dicts
    dict_handlers = DictHandlers(meta_manager.dict_manager)
    app.add_route(dict_handlers.cb_upload_dict, '/upload_dict', methods=['POST'])
    app.add_route(dict_handlers.cb_get_dictionary, '/dictionary/<dict_id>')
    app.add_route(dict_handlers.cb_get_dicts_stats, '/project/<project_uuid:int>/dicts/stats')

    # Handlers for tasks
    tasks_handlers = TasksHandlers(meta_manager.task_manager, socketio)
    app.add_route(tasks_handlers.cb_get_tasks, '/project/<project_uuid:int>/tasks')
    app.add_route(tasks_handlers.cb_create_task, '/project/<project_uuid:int>/tasks/create', methods=['POST'])

    # Handler for scans
    scans_handlers = ScansHandlers(meta_manager.scan_manager)
    app.add_route(scans_handlers.cb_count_scans, '/project/<project_uuid:int>/scans/count')

    # Handlers for files
    files_handlers = FilesHandlers(meta_manager.file_manager)
    app.add_route(files_handlers.cb_count_files, '/project/<project_uuid:int>/files/count')
    app.add_route(files_handlers.cb_stats_hosts, '/project/<project_uuid:int>/files/stats/hosts', methods=['POST'])
    app.add_route(files_handlers.cb_stats_ips, '/project/<project_uuid:int>/files/stats/ips', methods=['POST'])
    app.add_route(files_handlers.cb_get_files_host, '/project/<project_uuid:int>/files/data/host', methods=['POST'])
    app.add_route(files_handlers.cb_get_files_ip, '/project/<project_uuid:int>/files/data/ip', methods=['POST'])

    # Static handlers: index.html and bundle.js
    app.add_route(StaticHandlers.cb_index_handler, '/')
    app.add_route(StaticHandlers.cb_index_handler, '/project/<project_uuid>')
    app.add_route(StaticHandlers.cb_index_handler, '/project/<project_uuid>/dirsearch')
    app.add_route(StaticHandlers.cb_index_handler, '/project/<project_uuid>/host/<host>')
    app.add_route(StaticHandlers.cb_index_handler, '/project/<project_uuid>/ip/<host>')
    app.add_route(StaticHandlers.cb_bundle_handler, '/bundle.js')

    HANDLERS = Handlers(socketio, app, meta_manager)

    @app.listener('before_server_start')
    async def cb_instantiate_scheduler(app, loop):
        scheduler = AsyncIOScheduler()
        scheduler.add_job(HANDLERS.sender_loop, 'interval', seconds=1)
        scheduler.start()


    app.run(host=CONFIG['application']['host'], port=CONFIG['application']['port'], debug=False)
