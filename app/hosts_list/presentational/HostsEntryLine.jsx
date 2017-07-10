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
			rendered_hostname = (
				<div>
					<b>{this.props.host.hostname}</b>
					<div className="pull-right">
	                    <Link to={'/project/' + this.props.project.project_name + '/host/' + this.props.host.hostname}
	                          target="_blank">
							<Button bsStyle="default" bsSize="small">
								<Glyphicon glyph="zoom-in"/>
							</Button>					
	                    </Link>

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
