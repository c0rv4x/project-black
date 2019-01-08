import _ from 'lodash'
import React from 'react'

import {
	Button,
	Icon,
	Label,
	Segment,
	Transition
} from 'semantic-ui-react'

import { Box, Grid } from 'grommet'

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
		const verbose_host_link = '/project/' + project_uuid + '/ip/' + ip.ip_address;

		const ports = _.map(ip.scans.sort((a, b) => {
			if (a["port_number"] > b["port_number"]) return 1;
			if (a["port_number"] < b["port_number"]) return -1;
			return 0;
		}), (x) => {
			return (
				<Label key={x.scan_id + '_' + x.port_number}>
					{x.port_number} {x.banner}
				</Label>
			)
		});

		return (
			<Box gridArea={"ip_" + ip.ip_address} background="brand">
				<Box background="accent-1" />
				{/* <input
					ref={(iptext) => this.iptext = iptext}
					style={{
						"position": "absolute",
						"left": "-9999px"
					}}
				/>

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