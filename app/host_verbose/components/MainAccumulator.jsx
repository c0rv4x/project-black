import React from 'react'

import Main from '../presentational/Main.jsx'


class MainAccumulator extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<Main host={this.props.host}
				  ports={this.props.ports} />
		)
	}
}

export default MainAccumulator;