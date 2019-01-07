import React from 'react'
import loading from '../../common/loading/Loading.jsx'

import { Box, Grid } from 'grommet'

import IPTable from '../presentational/IPTable.jsx'
import HostTable from '../presentational/HostTable.jsx'
import ScanTable from '../presentational/ScanTable.jsx'
import FileTable from '../presentational/FileTable.jsx'


class ScopeSetup extends React.Component {
	render() {
		let { ips, hosts, scans, files } = this.props;

		const all_loaded = ips.loaded && hosts.loaded && scans.loaded && files.loaded;

		return (
			<div>
				<br />
				{
					all_loaded ? (
							<Grid
								columns={{
									count: 4,
									size: 'auto'
								}}	
							>
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
							</Grid>
					) : (
						loading
					)
				}
			</div>
		)
	}
}

export default ScopeSetup;
