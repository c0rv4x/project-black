import re
import json
from common.logger import log


@log
class Notifier:
    def __init__(self, socketio):
        self.socketio = socketio

        self.ip_regex = re.compile('^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}$')

    async def notify(self, task):
        data_type, target, project_uuid, text, task_name, task_status = task

        if data_type == "scan":
            await self.notify_on_scans(project_uuid, text, task_name, task_status)
        if data_type == "file":
            await self.notify_on_files(project_uuid, text, task_status)
        if data_type == "creds":
            await self.notify_on_creds(project_uuid, target, task_status)
        if data_type == "scope":
            await self.notify_on_scope(project_uuid, text, target, task_status)

    async def notify_on_scans(self, project_uuid, text, task_name, task_status):
        targets = None

        if text:
            self.logger.info("Task updated targets: {}".format(text))
            try:
                targets = json.loads(text)
            except:
                targets = text

        if targets:
            await self.send_scans_updated_notifications(targets, project_uuid)

    async def send_scans_updated_notifications(self, new_ips, project_uuid=None):
        """ Send notification which notes that the `updated_ips` have updated scans.
        The notification is sent both to hosts and ips to make sure the page gets reloaded """
        if new_ips:
            await self.socketio.emit(
                'ips:updated', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'updated_ips': new_ips
                },
                namespace='/ips'
            )

            await self.socketio.emit(
                'hosts:updated:ips', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'updated_ips': new_ips
                },
                namespace='/hosts'
            )

    async def notify_on_files(self, project_uuid, text, task_status):
        # Dirbuster found some files
        updated_target = None

        if text:
            updated_target = text.split(':')[0]

            await self.send_updated_files_notification(project_uuid, updated_target)

    async def send_updated_files_notification(self, project_uuid, updated_target=None):
        """ Send a notification that files for specific ids have changed """
        if self.ip_regex.match(updated_target):
            await self.socketio.emit(
                'ips:updated', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'updated_ips': [updated_target]
                },
                namespace='/ips'
            )  
        else:
            await self.socketio.emit(
                'hosts:updated', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'updated_hosts': [updated_target]
                },
                namespace='/hosts'
            )

    async def notify_on_creds(self, project_uuid, target, task_status):
        updated_target = target.split(':')[0]

        if self.ip_regex.match(updated_target):
            await self.socketio.emit(
                'ips:updated', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'updated_ips': [updated_target]
                },
                namespace='/ips'
            )  
        else:
            await self.socketio.emit(
                'hosts:updated', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'updated_hostname': [updated_target]
                },
                namespace='/hosts'
            )

    async def notify_on_scope(self, project_uuid, text, target, task_status):
        text = json.loads(text)

        if text["updated_hosts"]:
            await self.socketio.emit(
                'hosts:created', {
                    'status': 'success',
                    'project_uuid': project_uuid
                },
                room=None,
                namespace='/hosts'
            )

        if text["updated_ips"]:
            await self.socketio.emit(
                'ips:created', {
                    'status': 'success',
                    'project_uuid': project_uuid
                },
                room=None,
                namespace='/ips'
            )
