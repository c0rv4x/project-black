import _ from 'lodash'
import React from 'react'

import {
	Button,
	Icon,
	Label,
	Segment,
	Transition
} from 'semantic-ui-react'

import { Copy, Checkmark} from 'grommet-icons'
import {
	Box,
	Grid,
	Table,
	TableBody,
	TableRow,
	TableCell
} from 'grommet'

import ScopeComment from '../../../common/scope_comment/ScopeComment.jsx'
import TasksScoped from '../../../common/tasks_scoped/TasksScoped.jsx'
import Creds from '../../../common/creds/Creds.jsx'
import HidingButtons from './HidingButtons.jsx'
import Files from './Files.jsx'


class IPEntryLine extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			"copyPasteShown": false,
			"copySuccess": false,
			"hovered": false
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
		const verbose_host_link = '/project/' + project_uuid + '/ip/' + ip.ip_address;

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
					border={{
						size: "xsmall",
						color: "brand"
					}}
					round="xsmall"
				>
					<div><b>{x.port_number}</b></div>
					{x.banner}
				</Box>
			)
		});

		return (
			<Box
				gridArea={"ip_" + ip.ip_address}
				// elevation={this.state.hovered ? "xsmall" : "none"}
				onMouseOver={() => this.setState({ hovered: true })}
				onMouseOut={() => this.setState({ hovered: false })}
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
					columns={["small", "small", "auto", "small", "xsmall"]}
					rows={["auto"]}
				>
					<Box gridArea={"ipaddr-" + ip.ip_address} direction="row" align="center" gap="small" pad="small">
						<b
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
							style={{
								"cursor": "pointer"
							}}
						>
							{ip.ip_address}
						</b>
						{this.state.copyPasteShown && !this.state.copySuccess && <span>  <Copy /></span>}
						{this.state.copyPasteShown && this.state.copySuccess && <span>  <Checkmark /></span>}
					</Box>
					<Box gridArea={"comment-" + ip.ip_address} >
						<ScopeComment
							comment={ip.comment}
							onCommentSubmit={onCommentSubmit}
						/>
					</Box>
					<Box gridArea={"ports-" + ip.ip_address} >
								{ports}
					</Box>
					<Box gridArea={"files-" + ip.ip_address} >
						<Files target={ip} />
					</Box>
					<Box gridArea={"control-" + ip.ip_address} >
						<HidingButtons
							project_uuid={project_uuid}
							type="ip"
							target={ip.ip_address}
						/>
					</Box>
				</Grid>
				{/* 

				<Box gridArea="ip">
					<b
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
						style={{
							"cursor": "pointer"
						}}
					>
						{ip.ip_address}
					</b>
					{this.state.copyPasteShown && !this.state.copySuccess && <span>  <Icon color="blue" name="copy outline"/></span>}
					{this.state.copyPasteShown && this.state.copySuccess && <span>  <Icon color="blue" name="check"/></span>}
				</Box>
				<Box gridArea="comment">
					<ScopeComment
						comment={ip.comment}
						onCommentSubmit={onCommentSubmit}
					/>
				</Box>
				<Box gridArea="ports">
					<Label.Group>
						{ports}
					</Label.Group>
				</Box>
				<Box gridArea="files">
					<Files target={ip} />
				</Box>
				<Box gridArea="control">
					<HidingButtons
						project_uuid={project_uuid}
						type="ip"
						target={ip.ip_address}
					/>
				</Box> */}
			</Box>
		)	
	}
}

export default IPEntryLine;