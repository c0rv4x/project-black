import React from 'react'
import { Statistic } from 'semantic-ui-react'

import IPTable from '../presentational/IPTable.jsx'
import HostTable from '../presentational/HostTable.jsx'
import ScanTable from '../presentational/ScanTable.jsx'
import FileTable from '../presentational/FileTable.jsx'


class ScopeSetup extends React.Component {
	render() {
		let { ips, hosts, scans, files } = this.props;

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
				<FileTable
					files={files}
				/>
			</Statistic.Group>
		)
	}
}

export default ScopeSetup;
