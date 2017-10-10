import React from 'react'

import { Table } from 'react-bootstrap'


class DirsearchTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var files = [];

		if (this.props.files) {
			for (var each_file of this.props.files) {
				var status_code_style = {
					color: null
				};

				if (Math.floor(each_file.status_code / 100) == 2) status_code_style.color = '#22CF22';
				else status_code_style.color = '#333333';

				files.push(
					<tr key={each_file.file_id}>
						<td style={status_code_style}>{each_file.status_code}</td>
						<td><a href={each_file.file_path} target="_blank">{each_file.file_name}</a></td>
						<td>{each_file.content_length}</td>
						<td>{each_file.special_note}</td>
					</tr>
				);
			}
		}

		if (this.props.files && this.props.files.length) {
			return (
				<div>
					<h3>{this.props.target + ':' + this.props.port_number}</h3>
					<Table bordered hover>
						<thead>
							<tr>
								<td>Code</td>
								<td>File Name</td>
								<td>Length</td>
								<td>Special Note</td>
							</tr>
						</thead>
						<tbody>
							{files}
						</tbody>
					</Table>
				</div>
			)
		}
		else {
			return <span></span>
		}
	}
}

export default DirsearchTable;