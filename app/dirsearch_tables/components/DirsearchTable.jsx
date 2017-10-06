import React from 'react'

import { Table } from 'react-bootstrap'


class DirsearchTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Table bordered condensed hover>
				<thead>
					<tr>
						<th>Code</th>
						<th>File Name</th>
						<th>Length</th>
						<th>Special Note</th>
					</tr>
				</thead>
			</Table>
		)
	}
}

export default DirsearchTable;