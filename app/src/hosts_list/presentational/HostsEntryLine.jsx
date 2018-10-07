import React from 'react'

import {
	Button,
	Card,
	List,
	Header,
	Divider
} from 'semantic-ui-react'

import ScopeComment from '../../common/scope_comment/ScopeComment.jsx'
import HostsEntryLinePorts from './HostsEntryLinePorts.jsx'
import TasksScoped from '../../common/tasks_scoped/TasksScoped.jsx'
import Creds from '../../common/creds/Creds.jsx'


class HostsEntryLine extends React.Component {
	render() {
		const { host, project_uuid, deleteScope, onCommentSubmit } = this.props;
		const verbose_host_link = '/project/' + project_uuid + '/host/' + host.hostname;

		const footer = (
			<div>
				<TasksScoped
		        	target={host.hostname}
		        	tasks={host.tasks}
		        />
	            <a onClick={() => window.open(verbose_host_link, Math.random().toString(36).substring(7), 'width=850,height=700')}>
					<Button basic size="tiny">
						Verbose
					</Button>
	            </a>

				<Button basic color="red" size="tiny" onClick={deleteScope}>
					Delete
				</Button>
			</div>
		);

		let files_by_statuses = {
			'2xx': [],
			'3xx': [],
			'4xx': [],
			'5xx': []
		}

		const description = (
			<div>
				<Header>{host.hostname}</Header>
				<Divider />
				<ScopeComment comment={host.comment}
							  onCommentSubmit={onCommentSubmit} />

				<Creds
					scope={host}
					project_uuid={project_uuid}
				/>

				<Divider hidden />
				<List bulleted>
					<List.Item>2xx: <strong>{files_by_statuses['2xx'].length}</strong></List.Item> 
					<List.Item>3xx: {files_by_statuses['3xx'].length}</List.Item>
					<List.Item>4xx: {files_by_statuses['4xx'].length}</List.Item>
					<List.Item>5xx: {files_by_statuses['5xx'].length}</List.Item>
				</List>

				<HostsEntryLinePorts host={host} />
			</div>
		);

		return (
			<Card color="blue" fluid>
				<Card.Content description={description} />
				<Card.Content extra>{footer}</Card.Content>
			</Card>			
		)
	}
}

export default HostsEntryLine;
