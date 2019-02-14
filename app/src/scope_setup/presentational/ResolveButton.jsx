import _ from 'lodash'
import React from 'react'

import { Button } from 'grommet'


class ResolveButton extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			"color": "brand",
			"loading": false
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
        return (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
	}

	componentDidUpdate() {
		const { hostsResolved } = this.props;

		if (hostsResolved) {
			this.setState({
				loading: false
			})
		}
	}

	render() {
		let { color, loading } = this.state;

		return (
			<Button
				alignSelf="end"
				onClick={() => {
					this.setState({
						"color": "brand",
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
