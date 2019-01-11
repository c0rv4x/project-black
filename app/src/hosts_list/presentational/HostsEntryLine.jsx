import React from 'react'

import {
	Button,
	Card,
	List,
	Header,
	Divider
} from 'semantic-ui-react'

import {
	Box,
	Grid,
	Heading
} from 'grommet'
import { Copy, Checkmark} from 'grommet-icons'

import ScopeComment from '../../common/scope_comment/ScopeComment.jsx'
import HostsEntryLinePorts from './HostsEntryLinePorts.jsx'
import TasksScoped from '../../common/tasks_scoped/TasksScoped.jsx'
import Creds from '../../common/creds/Creds.jsx'
import HidingButtons from '../../ips_list/presentational/scope/HidingButtons.jsx'


class HostsEntryLine extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			"copyPasteShown": false,
			"copySuccess": false
		};

		this.copyToClipboard = this.copyToClipboard.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props)) || (!_.isEqual(this.state, nextState));
	}

	copyToClipboard(e) {
		this.hosttext.select();
		document.execCommand('copy');
		// This is just personal preference.
		// I prefer to not show the the whole text area selected.
		e.target.focus();

		this.setState({
			"copySuccess": true
		})
	};

	render() {
		const { host, project_uuid, deleteScope, onCommentSubmit } = this.props;

		const ipsWithPorts = host.ip_addresses.map((ip) => {
			return (
				<Box
					key={host.host_id + '_' + ip.ip_id}
					align="center"
					margin="xxsmall"
					pad="xsmall"
					border={{
						size: "xsmall",
						color: "brand"
					}}
					round="xsmall"
				>
					<Heading margin="xsmall" level="5">{ip.ip_address}</Heading>
					{
						ip.scans.map((scan) => {
							return (
								<Box
									key={scan.scan_id}
									align="center"
									margin="xxsmall"
									pad="xxsmall"
								>
									<Heading level="6" margin="none">{scan.port_number}</Heading>
									{scan.banner}
								</Box>
							)
						})
					}
				</Box>
			)
		});

		return (
			<Box
				gridArea={"host_" + host.host_id}
				pad="small"
				border={{
					size: "xsmall",
					color: "neutral-2"
				}}
				round="xsmall"
			>
				<input
					ref={(hosttext) => this.hosttext = hosttext}
					style={{
						"position": "absolute",
						"left": "-9999px"
					}}
				/>
				<Grid
					areas={[
						{ name: 'host-' + host.hostname, start: [0, 0], end: [0, 0] },
						{ name: 'comment-' + host.hostname, start: [1, 0], end: [1, 0] },
						{ name: 'ports-' + host.hostname, start: [2, 0], end: [2, 0] },
						{ name: 'files-' + host.hostname, start: [3, 0], end: [3, 0] },
						{ name: 'control-' + host.hostname, start: [4, 0], end: [4, 0] },
					]}
					columns={["small", "small", "auto", "small", "xsmall"]}
					rows={["auto"]}
				>
					<Box gridArea={"host-" + host.hostname} direction="row" align="center" gap="small" pad="small">
						<b
							onMouseOut={() => this.setState({
								"copyPasteShown": false,
								"copySuccess": false
							})}
							onMouseOver={() => this.setState({"copyPasteShown": true})}
							onClick={(e) => {
								if (document.queryCommandSupported('copy')) {
									this.hosttext.value = host.hostname;
									this.copyToClipboard(e);
								}
							}}
							style={{
								"cursor": "pointer"
							}}
						>
							{host.hostname}
						</b>
						{this.state.copyPasteShown && !this.state.copySuccess && <span>  <Copy /></span>}
						{this.state.copyPasteShown && this.state.copySuccess && <span>  <Checkmark /></span>}
					</Box>
					<Box gridArea={"comment-" + host.hostname} direction="row" align="center" gap="small" pad="small">
						<ScopeComment
							comment={host.comment}
							onCommentSubmit={onCommentSubmit}
						/>
					</Box>
					<Box gridArea={"ports-" + host.hostname}>
						{ipsWithPorts}
					</Box>
					<Box gridArea={"files-" + host.hostname} />
					<Box gridArea={"control-" + host.hostname}  direction="row" align="center" gap="small" >
						<HidingButtons
							project_uuid={project_uuid}
							type="host"
							target={host.hostname}
						/>
					</Box>
				</Grid>
			</Box>
		)
	}
}

export default HostsEntryLine;
