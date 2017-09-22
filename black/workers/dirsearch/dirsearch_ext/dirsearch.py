#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#
#  Author: Mauro Soria

import json
import socket
from time import sleep

from .lib.core import ArgumentParser, Saver
from .lib.controller import Controller
from .lib.output import CLIOutput

class Program(object):
    def __init__(self, url, task_id, project_uuid, socket_path, params_object):
        self.socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.socket.connect(socket_path)
        self.arguments = ArgumentParser(url, **params_object)
        self.output = CLIOutput()
        self.saver = Saver(task_id, project_uuid)
        self.controller = Controller("./black/workers/dirsearch/dirsearch_ext/", self.arguments, self.output, self.saver, socket_path)
