import _ from 'lodash'
import React from 'react'

import {
	Box,
	Grid,
	Heading
} from 'grommet'
import { Copy, Checkmark} from 'grommet-icons'

import ScopeComment from '../../../common/scope_comment/ScopeComment.jsx'
import TasksScoped from '../../../common/tasks_scoped/TasksScoped.jsx'
import Creds from '../../../common/creds/Creds.jsx'
import HidingButtons from './HidingButtons.jsx'
import FilesStats from '../../../common/files_stats/FilesStats.jsx'


class IPEntryLine extends React.Component {
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
		this.iptext.select();
		document.execCommand('copy');
		// This is just personal preference.
		// I prefer to not show the the whole text area selected.
		e.target.focus();

		this.setState({
			"copySuccess": true
		})
	  };

	render() {
		const { ip, project_uuid, deleteIP, onCommentSubmit } = this.props;

		const ports = _.map(ip.scans.sort((a, b) => {
			if (a["port_number"] > b["port_number"]) return 1;
			if (a["port_number"] < b["port_number"]) return -1;
			return 0;
		}), (x) => {
			return (
				<Box
					key={x.scan_id + '_' + x.port_number}
					align="center"
					margin="xxsmall"
					pad="xsmall"
					round="xsmall"
				>
					<div><Heading level="5">{x.port_number}</Heading></div>
					{x.banner}
				</Box>
			)
		});

		return (
			<Box
				pad="small"
				border={{
					size: "xsmall",
					color: "neutral-2"
				}}
				round="xsmall"
			>
				<input
					ref={(iptext) => this.iptext = iptext}
					style={{
						"position": "absolute",
						"left": "-9999px"
					}}
				/>
				<Grid
					areas={[
						{ name: 'ipaddr-' + ip.ip_address, start: [0, 0], end: [0, 0] },
						{ name: 'comment-' + ip.ip_address, start: [1, 0], end: [1, 0] },
						{ name: 'ports-' + ip.ip_address, start: [2, 0], end: [2, 0] },
						{ name: 'files-' + ip.ip_address, start: [3, 0], end: [3, 0] },
						{ name: 'control-' + ip.ip_address, start: [4, 0], end: [4, 0] },
					]}
					columns={["small", "small", "auto", "small", "small"]}
					rows={["auto"]}
					align="center"
				>
					<Box gridArea={"ipaddr-" + ip.ip_address} direction="row" gap="small" pad="small">
						<Heading
							onMouseOut={() => this.setState({
								"copyPasteShown": false,
								"copySuccess": false
							})}
							onMouseOver={() => this.setState({"copyPasteShown": true})}
							onClick={(e) => {
								if (document.queryCommandSupported('copy')) {
									this.iptext.value = ip.ip_address;
									this.copyToClipboard(e);
								}
							}}
							level="4"
							style={{
								"cursor": "pointer"
							}}
						>
							{ip.ip_address}
							{this.state.copyPasteShown && !this.state.copySuccess && <span>  <Copy color="plain" size="15px" /></span>}
							{this.state.copyPasteShown && this.state.copySuccess && <span>  <Checkmark color="plain" size="15px" /></span>}
						</Heading>
					</Box>
					<Box gridArea={"comment-" + ip.ip_address} gap="small" pad="small">
						<ScopeComment
							comment={ip.comment}
							onCommentSubmit={onCommentSubmit}
						/>
					</Box>
					<Box gridArea={"ports-" + ip.ip_address} direction="column" gap="small" pad="small">
						{ports}
					</Box>
					<Box gridArea={"files-" + ip.ip_address} direction="row" gap="small" pad="small">
						<FilesStats targetId={ip.ip_id} files={ip.files} />
					</Box>
					<Box gridArea={"control-" + ip.ip_address}  direction="row" gap="small" >
						<HidingButtons
							project_uuid={project_uuid}
							type="ip"
							target={ip.ip_address}
						/>
					</Box>
				</Grid>
			</Box>
		)	
	}
}

export default IPEntryLine;