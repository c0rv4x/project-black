import React from 'react'
import { Statistic } from 'semantic-ui-react'

import IPTable from '../presentational/IPTable.jsx'
import HostTable from '../presentational/HostTable.jsx'


class ScopeSetup extends React.Component {
	render() {
		let { ips, hosts } = this.props;

		return (
			<Statistic.Group widths='four' size='large'>
				<IPTable
					ips={ips}
				/>
				<HostTable
					hosts={hosts}
				/>
				<Statistic>
					<Statistic.Value>Some</Statistic.Value>
					<Statistic.Label>Ports</Statistic.Label>
				</Statistic>
				<Statistic>
					<Statistic.Value>Some</Statistic.Value>
					<Statistic.Label>Files</Statistic.Label>
				</Statistic>				
			</Statistic.Group>
		)
	}
}

export default ScopeSetup;
