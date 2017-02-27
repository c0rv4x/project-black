from libnmap.process import NmapProcess
from libnmap.parser import NmapParser

nm = NmapProcess("127.0.0.1, scanme.nmap.org")
nm.run()
print(nm.stdout)
nmap_report = NmapParser.parse(nm.stdout)
print(nmap_report.get_dict())

for scanned_hosts in nmap_report.hosts:
    print(scanned_hosts)