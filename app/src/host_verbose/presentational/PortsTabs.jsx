import _ from 'lodash'
import React from 'react'
import {
	Box,
	Heading,
	Tab,
	Tabs
} from 'grommet'

import DirsearchTable from '../../dirsearch_tables/components/DirsearchTable.jsx';


class PortsTabs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeIndex: 0
		}
	}

	render() {
		let { target, target_id, ports, stats, loaded, files, requestMoreFiles } = this.props;

		let panes = [];
		for (let port of ports) {
			let stats_for_port = _.get(stats, port.port_number, {});
			let total_for_port = _.get(stats_for_port, 'total', 0);

			panes.push(
				<Tab
					key={port.port_number}
					title={port.port_number}
				>
					<Box
						margin="small"
						align="center"
					>
				 		{total_for_port != 0 &&
				 			<DirsearchTable
				 				files={_.get(files, port.port_number, [])}
				 				stats={stats_for_port}
				 				target_id={target_id}
				 				target={target}
				 				port_number={port.port_number}
				 				requestMore={requestMoreFiles}
				 			/>
				 		}
				 		{total_for_port == 0 && 
				 			<Heading level="3">No files for this port</Heading>
				 		}
					</Box>
				</Tab>
			);		
		}

		if (loaded && (ports.length == 0)) {
			return (
				<Heading level="3">This host has no ports yet</Heading>
			)
		}
		else {
			return (
				<Tabs
					activeIndex={this.state.activeIndex}
					onActive={(index) => {this.setState({activeIndex: index})}}
				>
					{panes}
				</Tabs>
			)
		}
	}
}

export default PortsTabs;
