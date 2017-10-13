 import React from 'react'
import { 
	Button, 
	Panel, 
	Glyphicon,
	ListGroup,
	ListGroupItem,
	Row,
	Col
} from 'reactstrap'
import { Link } from 'react-router-dom'

import ScopeComment from '../../common/scope_comment/ScopeComment.jsx'
import HostsEntryLinePorts from './HostsEntryLinePorts.jsx'

class HostsEntryLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var rendered_hostname = null;
		if (this.props.host.hostname) {
			const verbose_host_link = '/project/' + this.props.project.project_uuid + '/host/' + this.props.host.hostname;
			rendered_hostname = (
				<div className="d-flex justify-content-between">
					<div className="align-self-center"><b>{this.props.host.hostname}</b></div>

					<div>
			            <a onClick={() => window.open(verbose_host_link, Math.random().toString(36).substring(7), 'width=850,height=700')}>
							<Button outline size="sm">
								Verbose
							</Button>
			            </a>

						<Button outline color="danger" size="sm" onClick={this.props.deleteScope}>
							Delete
						</Button>
					</div>
				</div>
			)
		}

		var files_by_statuses = {
			'2xx': this.props.host.files.filter((x) => {
				return Math.floor(x.status_code / 100) === 2;
			}).length,
			'3xx': this.props.host.files.filter((x) => {
				return Math.floor(x.status_code / 100) === 3;
			}).length,
			'4xx': this.props.host.files.filter((x) => {
				return Math.floor(x.status_code / 100) === 4 && x.status_code !== 404;
			}).length,	
			'5xx': this.props.host.files.filter((x) => {
				return Math.floor(x.status_code / 100) === 5 && x.status_code !== 404;
			}).length						
		};

		return (
			<Panel defaultExpanded header={rendered_hostname} bsStyle="primary">
				<ListGroup fill>
					<ListGroupItem key={this.props.project.project_uuid + "_" + this.props.host.hostname}>
						<ul>
							<li>Dirsearch: 
								<ul>
									<li>2xx: <strong>{files_by_statuses['2xx']}</strong></li> 
									<li>3xx: {files_by_statuses['3xx']}</li>
									<li>4xx: {files_by_statuses['4xx']}</li>
									<li>5xx: {files_by_statuses['5xx']}</li>
								</ul>
							</li>
							<li>Comment: <ScopeComment comment={this.props.host.comment}
									  				   onCommentSubmit={this.props.onCommentSubmit}/></li>
						</ul>
						
					</ListGroupItem>
					
					<HostsEntryLinePorts host={this.props.host} 
									     deleteScope={this.props.deleteScope} />

				</ListGroup>		
			</Panel>
		)
	}
}

export default HostsEntryLine;
