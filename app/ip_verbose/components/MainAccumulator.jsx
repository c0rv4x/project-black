import React from 'react'

import ScopeComment from '../../common/scope_comment/ScopeComment.jsx'
import PortsTabs from '../../host_verbose/presentational/PortsTabs.jsx'


class MainAccumulator extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			'activeTabNumber': null,
			'activePortNumber': null
		}				

		this.tabChange = this.tabChange.bind(this);
	}

	componentWillReceiveProps(newProps) {
		if (JSON.stringify(this.props.ports) !== JSON.stringify(newProps.ports)) {
			if (typeof this.state.activePortNumber === 'undefined') {
				this.setState({
					activePortNumber: newProps.ports[0].port_number,
					activeTabNumber: 0
				});
			}
		}
	}

	tabChange(newNumber, portNumber) {
		this.setState({
			activeTabNumber: newNumber,
			activePortNumber: portNumber
		});
	}

	render() {
		let { ip, ports, files } = this.props;

		return (
			<div>
				<h2>{ip.ip_address}</h2>
				<ScopeComment commentValue={ip.comment} />

				<PortsTabs ports={ports}
					   	   activeTabNumber={this.state.activeTabNumber}
					   	   tabChange={this.tabChange}
					   	   files={ip.files} />
			</div>
		)
	}
}

export default MainAccumulator;