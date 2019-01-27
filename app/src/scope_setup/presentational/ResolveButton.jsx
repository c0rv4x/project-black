import React from 'react'

import { Button } from 'grommet'


class ResolveButton extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			"color": "blue",
			"loading": false
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.hostsResolved) {
			this.setState({
				"color": "green",
				"loading": false
			});
		}
	}

	render() {
		let { color, loading } = this.state;

		return (
			<Button
				alignSelf="end"
				onClick={() => {
					this.setState({
						"color": "blue",
						"loading": true
					});
					this.props.resolveScopes();
				}}
				color={color}
				active={loading}
				disabled={loading}
				label="Resolve Hosts"
			/>
		)
	}
}

export default ResolveButton;
