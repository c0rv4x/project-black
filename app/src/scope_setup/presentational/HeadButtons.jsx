import React from 'react'

import { Button } from 'semantic-ui-react'


class HeadButtons extends React.Component {
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
				onClick={() => {
					this.setState({
						"color": "blue",
						"loading": true
					});
					this.props.resolveScopes();
				}}
				floated='right'
				size='small'
				color={color}
				loading={loading}
				active={loading}
			>
				Resolve Hosts
			</Button>
		)
	}
}

export default HeadButtons;
