import _ from 'lodash'
import React from 'react'
import {
	Header,
	Tab
} from 'semantic-ui-react'

import DirsearchTable from '../../dirsearch_tables/components/DirsearchTable.jsx';


class PortsTabs extends React.Component {
	render() {
		let { target, target_id, ports, stats, loaded, files, requestMoreFiles } = this.props;
		ports = ports.sort((a, b) => {
			if (a.port_number < b.port_number) return -1;
			if (a.port_number > b.port_number) return 1;
			return 0;
		});

		let panes = [];
		for (let port of ports) {
			let stats_for_port = _.get(stats, port.port_number, {});
			let total_for_port = _.get(stats_for_port, 'total', 0);

			panes.push({
				menuItem: String(port.port_number),
				render: () => (
					<Tab.Pane>
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
							<Header as="h3">No files for this port</Header>
						}
					</Tab.Pane>
				)
			});		
		}

		if (loaded && (panes.length == 0)) {
			return (
				<Header as="h3">This host has no ports yet</Header>
			)
		}
		else {
			return (
				<Tab onTabChange={(event, data) => { this.props.tabChange(data.activeIndex)} } panes={panes} />
			)
		}
	}
}

export default PortsTabs;
