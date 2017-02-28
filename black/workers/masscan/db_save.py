""" Work with the database """
import xmltodict
from uuid import uuid4

from black.db import sessions, Scan


def save_raw_output(task_id, output, project_name):
	# concated = "".join(map(lambda x: x.decode(), output))

	concated = """<?xml version="1.0"?>
	<!-- masscan v1.0 scan -->
	<?xml-stylesheet href="" type="text/xsl"?>
	<nmaprun scanner="masscan" start="1488272554" version="1.0-BETA"  xmloutputversion="1.03">
	<scaninfo type="syn" protocol="tcp" />
	<host endtime="1488272554"><address addr="213.180.193.14" addrtype="ipv4"/><ports><port protocol="tcp" portid="80"><state state="open" reason="syn-ack" reason_ttl="54"/></port></ports></host>
	<host endtime="1488272557"><address addr="213.180.193.3" addrtype="ipv4"/><ports><port protocol="tcp" portid="80"><state state="open" reason="syn-ack" reason_ttl="55"/></port></ports></host>
	<host endtime="1488272595"><address addr="213.180.193.14" addrtype="ipv4"/><ports><port protocol="tcp" portid="443"><state state="open" reason="syn-ack" reason_ttl="54"/></port></ports></host>
	<host endtime="1488272636"><address addr="213.180.193.12" addrtype="ipv4"/><ports><port protocol="tcp" portid="443"><state state="open" reason="syn-ack" reason_ttl="53"/></port></ports></host>
	<host endtime="1488272640"><address addr="213.180.193.12" addrtype="ipv4"/><ports><port protocol="tcp" portid="80"><state state="open" reason="syn-ack" reason_ttl="54"/></port></ports></host>
	<host endtime="1488272658"><address addr="213.180.193.3" addrtype="ipv4"/><ports><port protocol="tcp" portid="443"><state state="open" reason="syn-ack" reason_ttl="54"/></port></ports></host>
	<runstats>
	<finished time="1488272695" timestr="2017-02-28 12:04:55" elapsed="160" />
	<hosts up="6" down="0" total="6" />
	</runstats>
	</nmaprun>
	"""

	parsed_dict = xmltodict.parse(concated)

	for each_host in parsed_dict['nmaprun']['host']:
		print(each_host)