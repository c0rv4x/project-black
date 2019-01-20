import React from 'react'
import _ from 'lodash'

import {
	Box,
	Grid,
	Heading,
	Text
} from 'grommet'
import { Copy, Checkmark} from 'grommet-icons'

import ScopeComment from '../../common/scope_comment/ScopeComment.jsx'
import TasksScoped from '../../common/tasks_scoped/TasksScoped.jsx'
import HidingButtons from '../../ips_list/presentational/scope/HidingButtons.jsx'
import FilesStats from '../../common/files_stats/FilesStats.jsx'


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
					columns={["small", "small", "auto", "small", "small"]}
					rows={["auto"]}
					align="center"
				>
					<Box gridArea={"host-" + host.hostname} direction="row" pad="small">
						<Text
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
								"cursor": "pointer",
								"wordBreak": "break-word"
							}}
						>
							{host.hostname}
							{this.state.copyPasteShown && !this.state.copySuccess && <span>  <Copy color="plain" size="15px" /></span>}
							{this.state.copyPasteShown && this.state.copySuccess && <span>  <Checkmark color="plain" size="15px" /></span>}
						</Text>
					</Box>
					<Box gridArea={"comment-" + host.hostname} pad="small">
						<ScopeComment
							comment={host.comment}
							onCommentSubmit={onCommentSubmit}
						/>
					</Box>
					<Box gridArea={"ports-" + host.hostname} gap="small" pad="small">
						{ipsWithPorts}
					</Box>
					<Box gridArea={"files-" + host.hostname}>
						<FilesStats targetId={host.host_id} files={host.files} />
					</Box>
					<Box gridArea={"control-" + host.hostname}  direction="row" gap="small" >
						<HidingButtons
							project_uuid={project_uuid}
							type="host"
							scope={host}
							target={host.hostname}
						/>
					</Box>
				</Grid>
			</Box>
		)
	}
}

export default HostsEntryLine;
