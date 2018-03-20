""" Keeps class with notifications spawner """


async def send_notification(
    socketio, status, title, text, project_uuid=None, sid=None
):
    """ Get all files and send to all clients """
    await socketio.emit(
        'notification:new', {
            'status': status,
            'title': title,
            'text': text,
            'project_uuid': project_uuid
        },
        room=sid,
        namespace='/notifications'
    )
