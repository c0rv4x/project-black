import React from 'react'

import { Table } from 'semantic-ui-react'


class DirsearchTable extends React.Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));
	}

	render() {
		var files = [];

		const files_sorted = this.props.files.sort((a, b) => {
			if (a["status_code"] > b["status_code"]) return 1;
			if (a["status_code"] < b["status_code"]) return -1;
			return 0;
		});


		if (this.props.files) {
			for (var each_file of this.props.files) {
				var status_code_style = {
					color: null
				};

				if (Math.floor(each_file.status_code / 100) == 2) status_code_style.color = '#22CF22';
				else status_code_style.color = '#333333';

				files.push(
					<Table.Row key={each_file.file_id}>
						<Table.Cell style={status_code_style}>{each_file.status_code}</Table.Cell>
						<Table.Cell><a href={each_file.file_path} target="_blank">{each_file.file_name}</a></Table.Cell>
						<Table.Cell>{each_file.content_length}</Table.Cell>
						<Table.Cell>{each_file.special_note}</Table.Cell>
					</Table.Row>
				);
			}
		}

		if (this.props.files && this.props.files.length) {
			return (
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell colSpan='4'>{this.props.target + ':' + this.props.port_number}</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{files}
					</Table.Body>
				</Table>
			)
		}
		else {
			return <span></span>
		}
	}
}

export default DirsearchTable;