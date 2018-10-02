import React from 'react'

import { Table } from 'semantic-ui-react'


class DirsearchTable extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (!_.isEqual(nextProps, this.props));
	}

	render() {
		let files = [];
		let files_sorted = this.props.files.sort((a, b) => {
			if (a.status_code > b.status_code) return 1;
			if (a.status_code < b.status_code) return -1;
			if (a.file_name > b.file_name) return 1;
			if (a.file_name < b.file_name) return -1;
			return 0;
		});

		if (files_sorted) {
			for (let each_file of files_sorted) {
				let status_code_style = {
					color: null
				};

				if (Math.floor(each_file.status_code / 100) == 2) status_code_style.color = '#22CF22';
				else if (each_file.status_code == 401) status_code_style.color = '#F4DF42';
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
							<Table.HeaderCell width={1}>{this.props.target + ':' + this.props.port_number}</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
							<Table.HeaderCell width={2}>Bytes</Table.HeaderCell>
							<Table.HeaderCell>Redirect to</Table.HeaderCell>
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