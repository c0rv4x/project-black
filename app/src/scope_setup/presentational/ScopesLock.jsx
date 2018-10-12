import React from 'react'

import { Button } from 'semantic-ui-react'


class ScopesLock extends React.Component {
	render() {
        const { status, name, setLock } = this.props;

		if (status) return (
			<Button
				onClick={() => setLock(false)}
			>
				{"Unlock " + name}
			</Button>
		)
		else return (
			<Button
				onClick={() => setLock(true)}
			>
				{"Lock " + name}
			</Button>
		)
	}
}

export default ScopesLock;
