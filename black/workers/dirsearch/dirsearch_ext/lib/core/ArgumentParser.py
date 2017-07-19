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

from optparse import OptionParser, OptionGroup

from ...lib.utils.FileUtils import File
from ...lib.utils.FileUtils import FileUtils
from ...lib.utils.DefaultConfigParser import DefaultConfigParser
from ...thirdparty.oset import oset


class ArgumentParser(object):
    def __init__(self, url, wordlist="./black/workers/dirsearch/dirsearch_ext/db/dicc.txt", extensions=None, http_proxy=None, headers=None, user_agent=None, 
        user_random_agents=None, cookie=None, threads_count=1, exclude_status_codes=None, path="/",
        force_extensions=False, delay=1, timeout=2, ip_address=None, recursive=False, redirect=False):

        self.script_path = None

        self.url = url
        if extensions is None:
            print('No extension specified. You must specify at least one extension')
            exit(0)
        with File(wordlist) as file_wordlist:
            if not file_wordlist.exists():
                print('The wordlist file does not exist')
                exit(0)
            if not file_wordlist.isValid():
                print('The wordlist is invalid')
                exit(0)
            if not file_wordlist.canRead():
                print('The wordlist cannot be read')
                exit(0)
        if http_proxy is not None:
            if http_proxy.startswith('http://'):
                self.proxy = http_proxy
            else:
                self.proxy = 'http://{0}'.format(http_proxy)
        else:
            self.proxy = None
        if headers is not None:
            try:
                self.headers = dict((key.strip(), value.strip()) for (key, value) in (header.split(':', 1)
                                                                                      for header in headers))
            except Exception as _:
                print('Invalid headers')
                exit(0)
        else:
            self.headers = {}

        self.extensions = list(oset([extension.strip() for extension in extensions.split(',')]))
        self.user_agent = user_agent
        self.user_random_agents = user_random_agents
        self.cookie = cookie
        if threads_count < 1:
            print('Threads number must be a number greater than zero')
            exit(0)
        self.threads_count = threads_count
        if exclude_status_codes is not None:
            try:
                self.exclude_status_codes = list(
                    oset([int(exclude_status_code.strip()) if exclude_status_code else None for exclude_status_code in
                          exclude_status_codes.split(',')]))
            except ValueError:
                self.exclude_status_codes = []
        else:
            self.exclude_status_codes = []
        self.path = path
        self.wordlist = wordlist
        self.force_extensions = force_extensions

        self.delay = delay
        self.timeout = timeout
        self.ip_address = ip_address
        self.recursive = recursive

        # Well, here we have constants that were used in the original dirsearch,
        # BUT i am too lazy to remove them totally. Moreover, we will probably need them in future
        self.max_retries = 3

        self.json_output_file = "./output"

        self.scan_subdirs = None
        self.exclude_subdirs = None

        self.redirect = redirect
        self.request_by_name = True

        self.lowercase = False

        self.use_random_agents = False
        self.test_fail_path = ""
