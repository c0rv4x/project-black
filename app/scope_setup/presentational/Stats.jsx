import React from 'react'
import { Statistic } from 'semantic-ui-react'

import IPTable from '../presentational/IPTable.jsx'
import HostTable from '../presentational/HostTable.jsx'
import ScanTable from '../presentational/ScanTable.jsx'


class ScopeSetup extends React.Component {
	render() {
		let { ips, hosts, scans } = this.props;

		return (
			<Statistic.Group widths='four'>
				<IPTable
					ips={ips}
				/>
				<HostTable
					hosts={hosts}
				/>
				<ScanTable
					scans={scans}
				/>
				<Statistic>
					<Statistic.Value>Some</Statistic.Value>
					<Statistic.Label>Files</Statistic.Label>
				</Statistic>				
			</Statistic.Group>
		)
	}
}

export default ScopeSetup;
