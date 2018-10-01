import _ from 'lodash'
import React from 'react'
import {
	Header,
	Tab,
	Table
} from 'semantic-ui-react'


class PortsTabs extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let { ports, loaded } = this.props;
		ports = ports.sort((a, b) => {
			if (a.port_number < b.port_number) return -1;
			if (a.port_number > b.port_number) return 1;
			return 0;
		});

		let panes = [];

		for (let port of ports) {
			let filtered_files = _.filter(this.props.files, (y) => {
				return port.port_number == y.port_number;
			});

			filtered_files = filtered_files.sort((a, b) => {
				if (a.status_code > b.status_code) return 1;
				if (a.status_code < b.status_code) return -1;
				return 0;
			});

			const files = _.map(filtered_files, (port) => {
				let result = Math.floor(port.status_code / 100);
			
				if (result == 2) {
					return <Table.Row key={port.file_id}>
								<Table.Cell style={{'color': '#22CF22'}}>{port.status_code}</Table.Cell>
								<Table.Cell>{port.content_length}</Table.Cell>
								<Table.Cell><a href={port.file_path} target="_blank">{port.file_name}</a></Table.Cell>
								<Table.Cell></Table.Cell>
						   </Table.Row>
				}
				else {
					return <Table.Row key={port.file_id}>
								<Table.Cell>{port.status_code}</Table.Cell>
								<Table.Cell>{port.content_length}</Table.Cell>
								<Table.Cell><a href={port.file_path} target="_blank">{port.file_name}</a></Table.Cell>
								<Table.Cell>{port.special_note &&port.special_note}</Table.Cell>
						   </Table.Row>
				}
			});

			panes.push({
				menuItem: String(port.port_number),
				render: () => (
					<Tab.Pane>
						<Table>
							<Table.Body>
								{files}
							</Table.Body>
						</Table>
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
