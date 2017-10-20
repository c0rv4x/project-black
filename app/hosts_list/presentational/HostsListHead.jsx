import React from 'react'
import { Header } from 'semantic-ui-react'


class HostsListHead extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Header as="h4">Here you can manipulate with hosts. Scan them, pwn them, DDoS them.</Header>
		)
	}
}

export default HostsListHead;
