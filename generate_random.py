import json
import string
import random


def generate_string():
    return ''.join([random.choice(string.ascii_lowercase) for _ in range(15)])


class HostGenerator:
    def __init__(self):
        self.current_id = 0
        self.hosts = []

        self.file_generator = FileGenerator()

    def generate_single_host(self):
        self.current_id += 1

        host = {
            'id': self.current_id,
            'comment': '',
            'hostname': generate_string(),
            'files': []
        }

        self.hosts.append(host)

    def generate_hosts(self, hosts_amount):
        for _ in range(hosts_amount):
            self.generate_single_host()

        for host in self.hosts:
            for _ in range(random.randint(0, 5000)):
                host['files'].append(
                    self.file_generator.generate_single_file(host['hostname'], random.choice([443, 80])))
    
    def write_elastic_hosts(self):
        with open("./hosts_random.json", 'w') as w:
            for host in host_generator.hosts:
                w.write(json.dumps({
                    "index": {"_index": "hosts", "_id": host['id'], '_type': 'host'}
                }) + "\n")

                w.write(json.dumps({
                    'id': host['id'],
                    'comment': host['comment'],
                    'hostname': host['hostname']
                }) + "\n")

    def write_elastic_files(self):
        with open("./files_random.json", 'w') as w:
            for host in host_generator.hosts:
                for file in host['files']:
                    w.write(json.dumps({
                        "index": {"_index": "files", "_id": file['id'], '_type': 'file'}
                    }) + "\n")

                    w.write(json.dumps({
                        'id': file['id'],
                        'status_code': file['status_code'],
                        'port': file['port'],
                        'file': file['file'],
                        'target': host['hostname']
                    }) + "\n")

class FileGenerator:
    def __init__(self):
        self.current_id = 0

    def generate_single_file(self, host, port):
        self.current_id += 1

        return {
            'id': self.current_id,
            'status_code': random.choice([200, 400, 403, 500]),
            'target': host,
            'port': port,
            'file': '__' + generate_string()
        }

if __name__ == '__main__':
    import sys

    host_generator = HostGenerator()
    host_generator.generate_hosts(int(sys.argv[1]))
    host_generator.write_elastic_hosts()
    host_generator.write_elastic_files()
