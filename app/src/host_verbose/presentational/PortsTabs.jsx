import _ from 'lodash'
import React from 'react'
import {
	Header,
	Tab,
	Table
} from 'semantic-ui-react'

import DirsearchTable from '../../dirsearch_tables/components/DirsearchTable.jsx';
import FilesSocketioEventsEmitter from '../../redux/files/FilesSocketioEventsEmitter.js'


class PortsTabs extends React.Component {
	constructor(props) {
		super(props);

		this.filesEmitter = new FilesSocketioEventsEmitter();

		this.getFilesHosts = this.getFilesHosts.bind(this);
	}

	getFilesHosts(host, port_number, limit=3, offset=0) {
		this.filesEmitter.requestFilesHosts(
			this.props.project_uuid,
			host,
			port_number,
			limit,
			offset
		);
	}	

	render() {
		let { host, ports, stats, loaded, files } = this.props;
		ports = ports.sort((a, b) => {
			if (a.port_number < b.port_number) return -1;
			if (a.port_number > b.port_number) return 1;
			return 0;
		});

		let panes = [];
		for (let port of ports) {
			let stats_for_port = _.get(stats, port.port_number, {});
			let total_for_port = _.get(stats_for_port, 'total', 0);
			console.log(files);
			panes.push({
				menuItem: String(port.port_number),
				render: () => (
					<Tab.Pane>
						{total_for_port != 0 &&
							<DirsearchTable
								files={_.get(files, port.port_number, [])}
								stats={stats_for_port}
								target_id={host.host_id}
								target={host.hostname}
								port_number={port.port_number}
								requestMore={this.getFilesHosts}
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
