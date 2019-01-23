import React from 'react'
import loading from '../../common/loading/Loading.jsx'

import { Box, Grid } from 'grommet'

import Statistic from '../presentational/Statistic.jsx'


class ScopeSetup extends React.Component {
	render() {
		let { ips, hosts, scans, files, project } = this.props;

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
								<Statistic
									number={ips.total_db_ips}
									locked={project.ips_locked}
									text="ips"
								/>
								<Statistic
									number={hosts.total_db_hosts}
									locked={project.hosts_locked}
									text="hosts"
								/>
								<Statistic
									number={scans.amount}
									text="ports"
								/>
								<Statistic
									number={files.amount}
									text="files"
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
