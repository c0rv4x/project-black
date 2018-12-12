import React from 'react'
import { Dimmer, Loader, Segment, Statistic } from 'semantic-ui-react'

import IPTable from '../presentational/IPTable.jsx'
import HostTable from '../presentational/HostTable.jsx'
import ScanTable from '../presentational/ScanTable.jsx'
import FileTable from '../presentational/FileTable.jsx'


class ScopeSetup extends React.Component {
	render() {
		let { ips, hosts, scans, files } = this.props;

		const all_loaded = ips.loaded && hosts.loaded && scans.loaded && files.loaded;

		return (
			<Segment>
				<Dimmer active={!all_loaded} inverted>
					<Loader />
				</Dimmer>
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
			</Segment>
		)
	}
}

export default ScopeSetup;
