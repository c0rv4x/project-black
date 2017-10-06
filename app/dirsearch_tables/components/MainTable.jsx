import React from 'react'

import Filtering from './Filtering.jsx'
import TablesAccumulator from './TablesAccumulator.jsx'


class MainTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				This is the main table
				<Filtering />
				<br />

				<TablesAccumulator />
			</div>
		)
	}
}

export default MainTable;