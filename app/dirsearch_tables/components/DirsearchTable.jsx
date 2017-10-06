import React from 'react'

import { Table } from 'react-bootstrap'


class DirsearchTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var files = [];

		if (this.props.files)
			for (var each_file of this.props.files) {
				files.push(
					<tr key={each_file.file_id}>
						<th>{each_file.status_code}</th>
						<th>{each_file.file_name}</th>
						<th>{each_file.content_length}</th>
						<th>{each_file.special_note}</th>
					</tr>
				);
			}

		if (this.props.files && this.props.files.length) {
			return (
				<div>
					<h3>{this.props.target + ':' + this.props.port_number}</h3>
					<Table bordered condensed hover>
						<thead>
							<tr>
								<th>Code</th>
								<th>File Name</th>
								<th>Length</th>
								<th>Special Note</th>
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