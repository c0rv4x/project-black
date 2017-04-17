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

import os
from queue import Queue
import time
import sys
import gc
import urllib
from threading import Lock

from ...lib.connection import Requester, RequestException
from ...lib.core import Dictionary, Fuzzer, ReportManager, Saver
from ...lib.reports import JSONReport
from ...lib.utils import FileUtils


class SkipTargetInterrupt(Exception):
    pass


class Controller(object):
    def __init__(self, script_path, arguments, output, saver):
        self.saver = saver
        self.script_path = script_path
        self.exit = False
        self.arguments = arguments
        self.output = output
        self.savePath = self.script_path
        self.reportsPath = FileUtils.buildPath(self.savePath, "logs")
        self.blacklists = self.getBlacklists()
        self.fuzzer = None
        self.exclude_status_codes = self.arguments.exclude_status_codes
        self.recursive = self.arguments.recursive
        self.directories = Queue()
        self.exclude_subdirs = (arguments.exclude_subdirs if arguments.exclude_subdirs is not None else [])

        self.dictionary = Dictionary(self.arguments.wordlist, self.arguments.extensions,
                                     self.arguments.lowercase, self.arguments.force_extensions)
        self.errorLog = None
        self.errorLogPath = None
        self.errorLogLock = Lock()
        self.batch = False
        self.batchSession = None
        self.setupErrorLogs()
        self.output.newLine("\nError Log: {0}".format(self.errorLogPath))
        if self.arguments.use_random_agents:
            self.randomAgents = FileUtils.getLines(FileUtils.buildPath(script_path, "db", "user-agents.txt"))
        try:
            url = self.arguments.url
            try:
                gc.collect()
                self.reportManager = ReportManager()
                self.currentUrl = url
                self.output.target(self.currentUrl)
                try:
                    self.requester = Requester(url, cookie=self.arguments.cookie,
                                           user_agent=self.arguments.user_agent, maxPool=self.arguments.threads_count,
                                           max_retries=self.arguments.max_retries, delay=self.arguments.delay, timeout=self.arguments.timeout,
                                           ip=self.arguments.ip_address, proxy=self.arguments.proxy,
                                           redirect=self.arguments.redirect, 
                                           request_by_name=self.arguments.request_by_name)
                    self.requester.request("/")

                except RequestException as e:
                    self.output.error(e.args[0]['message'])
                    raise SkipTargetInterrupt
                if self.arguments.use_random_agents:
                    self.requester.setRandomAgents(self.randomAgents)
                for key, value in arguments.headers.items():
                    self.requester.setHeader(key, value)
                # Initialize directories Queue with start Path
                self.basePath = self.requester.basePath
                if self.arguments.scan_subdirs is not None:
                    for subdir in self.arguments.scan_subdirs:
                        self.directories.put(subdir)
                else:
                    self.directories.put('')
                self.setupReports(self.requester)
                matchCallbacks = [self.matchCallback]
                notFoundCallbacks = [self.notFoundCallback]
                errorCallbacks = [self.errorCallback, self.appendErrorLog]
                self.fuzzer = Fuzzer(self.requester, self.dictionary, testFailPath=self.arguments.test_fail_path,
                                     threads=self.arguments.threads_count, matchCallbacks=matchCallbacks,
                                     notFoundCallbacks=notFoundCallbacks, errorCallbacks=errorCallbacks)
                self.wait()
            except SkipTargetInterrupt:
                pass
            finally:
                self.reportManager.save()

                
        except KeyboardInterrupt:
            self.output.error('\nCanceled by the user')
            exit(0)
        finally:
            if not self.errorLog.closed:
                self.errorLog.close()
            self.reportManager.close()

        self.output.warning('\nFinished')

    def getSavePath(self):
        basePath = None
        dirPath = None
        basePath = os.path.expanduser('~')
        dirPath = ".dirsearch"

        return FileUtils.buildPath(basePath, dirPath)

    def getBlacklists(self):
        blacklists = {}
        for status in [400, 403, 500]:
            blacklistFileName = FileUtils.buildPath(self.script_path, 'db')
            blacklistFileName = FileUtils.buildPath(blacklistFileName, '{}_blacklist.txt'.format(status))
            if not FileUtils.canRead(blacklistFileName):
                # Skip if cannot read file
                continue
            blacklists[status] = []
            for line in FileUtils.getLines(blacklistFileName):
                # Skip comments
                if line.lstrip().startswith('#'):
                    continue
                blacklists[status].append(line)
        return blacklists

    def setupErrorLogs(self):
        fileName = "errors-{0}.log".format(time.strftime('%y-%m-%d_%H-%M-%S'))
        self.errorLogPath = FileUtils.buildPath(FileUtils.buildPath(self.savePath, "logs", fileName))
        self.errorLog = open(self.errorLogPath, "w")

    def setupBatchReports(self):
        self.batch = True
        self.batchSession = "BATCH-{0}".format(time.strftime('%y-%m-%d_%H-%M-%S'))
        self.batchDirectoryPath = FileUtils.buildPath(self.savePath, "reports", self.batchSession)
        if not FileUtils.exists(self.batchDirectoryPath):
            FileUtils.createDirectory(self.batchDirectoryPath)
            if not FileUtils.exists(self.batchDirectoryPath):
                self.output.error("Couldn't create batch folder {}".format(self.batchDirectoryPath))
                sys.exit(1)
        if FileUtils.canWrite(self.batchDirectoryPath):
            FileUtils.createDirectory(self.batchDirectoryPath)
            targetsFile = FileUtils.buildPath(self.batchDirectoryPath, "TARGETS.txt")
            FileUtils.writeLines(targetsFile, self.arguments.url_list)
        else:
            self.output.error("Couldn't create batch folder {}.".format(self.batchDirectoryPath))
            sys.exit(1)

    def setupReports(self, requester):
        self.reportManager.addOutput(JSONReport(requester.host, requester.port, requester.protocol,
                                                requester.basePath, self.arguments.json_output_file))

    def matchCallback(self, path):
        self.index += 1
        if path.status is not None:
            to_continue = path.status not in self.exclude_status_codes and self.blacklists.get(path.status) is None
            to_continue = to_continue or (self.blacklists.get(path.status) is not None and path.path not in self.blacklists.get(path.status))
            if  to_continue:
                self.output.statusReport(path.path, path.response)
                self.addDirectory(path.path)
                self.reportManager.addPath(self.currentDirectory + path.path, path.status, path.response)

                self.saver.save(urllib.parse.urljoin(self.arguments.url, self.currentDirectory + path.path), 
                    path.status,
                    path.response)

                self.reportManager.save()
                del path

    def notFoundCallback(self, path):
        self.index += 1
        self.output.lastPath(path, self.index, len(self.dictionary))
        del path

    def errorCallback(self, path, errorMsg):
        self.output.addConnectionError()
        del path

    def appendErrorLog(self, path, errorMsg):
        with self.errorLogLock:
            line = time.strftime('[%y-%m-%d %H:%M:%S] - ')
            line += self.currentUrl + " - " + path + " - " + errorMsg
            self.errorLog.write(os.linesep + line)
            self.errorLog.flush()

    def handleInterrupt(self):
        self.output.warning('CTRL+C detected: Pausing threads, please wait...')
        self.fuzzer.pause()
        try:
            while True:
                msg = "[e]xit / [c]ontinue"
                if not self.directories.empty():
                    msg += " / [n]ext"
                if len(self.arguments.url_list) > 1:
                    msg += " / [s]kip target"
                self.output.inLine(msg + ': ')

                option = input()
                if option.lower() == 'e':
                    self.exit = True
                    self.fuzzer.stop()
                    raise KeyboardInterrupt
                elif option.lower() == 'c':
                    self.fuzzer.play()
                    return
                elif not self.directories.empty() and option.lower() == 'n':
                    self.fuzzer.stop()
                    return
                elif len(self.arguments.url_list) > 1 and option.lower() == 's':
                    raise SkipTargetInterrupt
                else:
                    continue
        except KeyboardInterrupt as SystemExit:
            self.exit = True
            raise KeyboardInterrupt


    def processPaths(self):
        while True:
            try:
                while not self.fuzzer.wait(0.3):
                    continue
                break
            except (KeyboardInterrupt, SystemExit) as e:
                self.handleInterrupt()

    def wait(self):
        while not self.directories.empty():
            self.index = 0
            self.currentDirectory = self.directories.get()
            self.output.warning('[{1}] Starting: {0}'.format(self.currentDirectory, time.strftime('%H:%M:%S')))
            self.fuzzer.requester.basePath = self.basePath + self.currentDirectory
            self.output.basePath = self.basePath + self.currentDirectory
            self.fuzzer.start()
            self.processPaths()
        return

    def addDirectory(self, path):
        if not self.recursive:
            return False
        if path.endswith('/'):
            if path in [directory + '/' for directory in self.exclude_subdirs]:
                return False
            self.directories.put(self.currentDirectory + path)
            return True
        else:
            return False
