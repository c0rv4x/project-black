import React from 'react'

import DirsearchTable from './DirsearchTable.jsx'


class TablesAccumulator extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var tables = [];

		for (var each_ip of this.props.ips) {
			for (var each_port of _.get(this.props.ports, each_ip.ip_address, [])) {
				let files_by_ip = _.get(this.props.files, each_ip.ip_address, []);
				let files = files_by_ip.filter((x) => {
					return x.port_number == each_port.port_number;
				});

				console.log(files);

				tables.push(
					<DirsearchTable key={each_ip._id} 
									target={each_ip.ip_address}
									port_number={each_port.port_number}
									files={files}/>
				);				
			}
		}

		for (var each_host of this.props.hosts) {
			for (var each_ip_address of each_host.ip_addresses) {				
				for (var each_port of _.get(this.props.ports, each_ip_address, [])) {
					tables.push(
						<DirsearchTable key={each_host._id} 
										target={each_host.hostname}
										port_number={each_port.port_number} />
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
