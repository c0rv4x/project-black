import _ from 'lodash'
import React from 'react'

import {
	Button,
	Grid,
	Icon,
	Label,
	Segment,
	Transition
} from 'semantic-ui-react'

import ScopeComment from '../../../common/scope_comment/ScopeComment.jsx'
import TasksScoped from '../../../common/tasks_scoped/TasksScoped.jsx'
import Creds from '../../../common/creds/Creds.jsx'


class IPEntryLine extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			"copyPasteShown": false,
			"copySuccess": ""
		};

		this.copyToClipboard = this.copyToClipboard.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps['ip'], this.props['ip'])) || (!_.isEqual(this.state, nextState));
	}

	copyToClipboard(e) {
		this.iptext.select();
		document.execCommand('copy');
		// This is just personal preference.
		// I prefer to not show the the whole text area selected.
		e.target.focus();
		console.log("Copied");
		this.setState({ copySuccess: 'Copied!' });
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
					{x.port_number}
				</Label>
			)
		});

		return (
			<Segment>
				<input
					ref={(iptext) => this.iptext = iptext}
					style={{
						"position": "absolute",
						"left": "-9999px"
					}}
				/>
				<Grid centered>
					<Grid.Row verticalAlign='middle' columns={16}>
						<Grid.Column width={3}>
							<b
								onMouseOut={() => this.setState({"copyPasteShown": false})}
								onMouseOver={() => this.setState({"copyPasteShown": true})}
								onClick={(e) => {
									if (document.queryCommandSupported('copy')) {
										this.iptext.value = ip.ip_address;
										this.copyToClipboard(e);
									}
								}}
							>
								{ip.ip_address}
							</b> 
							{this.state.copyPasteShown && <Icon name="copy outline" />}
						</Grid.Column>
						<Grid.Column width={5}>
							<ScopeComment
								comment={ip.comment}
								onCommentSubmit={onCommentSubmit}
							/>
						</Grid.Column>
						<Grid.Column width={7}>
							{ports}
						</Grid.Column>
						<Grid.Column width={1} textAlign="right">
							<Button basic icon size="small">
								<Icon name='ellipsis horizontal' />
							</Button>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		)	
	}
}

export default IPEntryLine;