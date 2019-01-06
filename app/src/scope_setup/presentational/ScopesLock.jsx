import React from 'react'

import { Button } from 'grommet'

class ScopesLock extends React.Component {
	render() {
        const { status, name, setLock } = this.props;

		if (status) return (
			<Button
				alignSelf="start"
				size='small'
				onClick={() => setLock(false)}
				label={"Unlock " + name}
			/>
		)
		else return (
			<Button
				alignSelf="start"
				size='small'
				onClick={() => setLock(true)}
				label={"Lock " + name}
			/>
		)
	}
}

export default ScopesLock;
