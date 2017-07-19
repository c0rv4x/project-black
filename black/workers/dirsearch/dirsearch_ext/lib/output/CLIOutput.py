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

import threading
import time
import sys
import platform
import urllib.parse

from ...lib.utils.FileUtils import *
from ...lib.utils.TerminalSize import get_terminal_size


class CLIOutput(object):
    def __init__(self):
        self.lastLength = 0
        self.lastOutput = ''
        self.lastInLine = False
        self.mutex = threading.Lock()
        self.blacklists = {}
        self.mutexCheckedPaths = threading.Lock()
        self.basePath = None
        self.errors = 0

    def inLine(self, string):
        self.erase()
        sys.stdout.write(string)
        sys.stdout.flush()
        self.lastInLine = True

    def erase(self):
        sys.stdout.write('\033[1K')
        sys.stdout.write('\033[0G')

    def newLine(self, string):
        if self.lastInLine == True:
            self.erase()

        sys.stdout.write(string + '\n')
        sys.stdout.flush()
        self.lastInLine = False
        sys.stdout.flush()

    def statusReport(self, path, response, url):
        with self.mutex:
            contentLength = None
            status = response.status

            # Check blacklist
            if status in self.blacklists and path in self.blacklists[status]:
                return

            # Format message
            try:
                size = int(response.headers['content-length'])
            except (KeyError, ValueError):
                size = len(response.body)
            finally:
                contentLength = FileUtils.sizeHuman(size)

            if self.basePath is None:
                showPath = urllib.parse.urljoin("/", path)
            else:
                showPath = urllib.parse.urljoin("/", self.basePath)
                showPath = urllib.parse.urljoin(showPath, path)
            message = '[{0}] {1} - {2} - {3} // {4}'.format(
                time.strftime('%H:%M:%S'),
                status,
                contentLength.rjust(6, ' '),
                showPath,
                url
            )

            if status == 200:
                message = message
            elif status == 403:
                message = message
            elif status == 401:
                message = message
            # Check if redirect
            elif status in [301, 302, 307] and 'location' in [h.lower() for h in response.headers]:
                message = message
                message += '  ->  {0}'.format(response.headers['location'])

            self.newLine(message)

    def lastPath(self, path, index, length):
        with self.mutex:
            percentage = lambda x, y: float(x) / float(y) * 100
            x, y = get_terminal_size()
            message = '{0:.2f}% - '.format(percentage(index, length))
            if self.errors > 0:
                message += 'Errors: {0}'.format(self.errors)
                message += ' - '
            message += 'Last request to: {0}'.format(path)
            if len(message) > x:
                message = message[:x]
            self.inLine(message)

    def addConnectionError(self):
        self.errors += 1

    def error(self, reason):
        with self.mutex:
            stripped = reason.strip()
            start = reason.find(stripped[0])
            end = reason.find(stripped[-1]) + 1
            message = reason[0:start]
            message += reason[start:end]
            message += reason[end:]
            self.newLine(message)

    def warning(self, reason):
        message = reason
        self.newLine(message)

    def header(self, text):
        message = text
        self.newLine(message)

    def target(self, target):
        config = '\nTarget: {0}\n'.format(target)
        self.newLine(config)

    def debug(self, info):
        line = "[{0}] - {1}".format(time.strftime('%H:%M:%S'), info)
        self.newLine(line)
