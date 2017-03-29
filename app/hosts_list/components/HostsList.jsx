import React from 'react'

import HostsListHead from '../presentational/HostsListHead.jsx'


class HostsList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<HostsListHead />
		)
	}
}

export default HostsList;