import React from 'react'

import DirsearchTable from './DirsearchTable.jsx'


class TablesAccumulator extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var tables = [];
		console.log(this.props);

		for (var each_ip of this.props.ips) {
			for (var each_port of each_ip.scans) {
			// for (var each_port of _.get(this.props.ports, each_ip.ip_address, [])) {
				let files_by_ip = _.get(this.props.files, each_ip.ip_address, []);
				let files = files_by_ip.filter((x) => {
					return x.port_number == each_port.port_number;
				});

				tables.push(
					<DirsearchTable key={each_ip._id + "_" + each_port.scan_id} 
									target={each_ip.ip_address}
									port_number={each_port.port_number}
									files={files}/>
				);				
			}
		}

		for (var each_host of this.props.hosts) {
			let files_by_host = _.get(this.props.files, each_host.hostname, []);
			for (var each_ip_address of each_host.ip_addresses) {				
				for (var each_ip_address of each_ip.scans) {
				// for (var each_port of _.get(this.props.ports, each_ip_address, [])) {
					let files = files_by_host.filter((x) => {
						return x.port_number == each_port.port_number;
					});

					tables.push(
						<DirsearchTable key={each_host._id + "_" + each_port.scan_id} 
										target={each_host.hostname}
										port_number={each_port.port_number}
										files={files}/>
					);
				}
			}
		}		

		return (
			<div>
				{tables}
			</div>
		)
	}
}

export default TablesAccumulator;
