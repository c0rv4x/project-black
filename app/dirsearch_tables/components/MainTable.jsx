import React from 'react'

import Filtering from './Filtering.jsx'


class MainTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (

			<div>
				This is the main table
				<Filtering />
			</div>
		)
	}
}

export default MainTable;