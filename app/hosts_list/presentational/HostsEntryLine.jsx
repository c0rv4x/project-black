 import React from 'react'
import { 
	Button, 
	Panel, 
	Glyphicon,
	ListGroup,
	ListGroupItem,
	Row,
	Col
} from 'react-bootstrap'
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
				<div>
					<span><b>{this.props.host.hostname}</b></span>
					<div className="pull-right">
	                    <a onClick={() => window.open(verbose_host_link, 'newwindow', 'width=500,height=500')}>
							<Button bsStyle="default" bsSize="small">
								<Glyphicon glyph="zoom-in"/>
							</Button>					
	                    </a>

						<Button bsStyle="danger" bsSize="small" onClick={this.props.deleteScope}>
							<Glyphicon glyph="remove"/>
						</Button>
					</div>
				</div>
			)
		}

		return (
			<Panel defaultExpanded header={rendered_hostname} bsStyle="primary">
				<ListGroup fill>
					<ListGroupItem key={this.props.project.project_uuid + "_" +this.props.host.hostname}>
						<ScopeComment comment={this.props.host.comment}
									  onCommentSubmit={this.props.onCommentSubmit}/>
					</ListGroupItem>
					
					<HostsEntryLinePorts host={this.props.host} 
									     deleteScope={this.props.deleteScope} />

				</ListGroup>		
			</Panel>
		)
	}
}

export default HostsEntryLine;
