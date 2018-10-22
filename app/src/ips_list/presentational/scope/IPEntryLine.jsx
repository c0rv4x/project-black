import _ from 'lodash'
import React from 'react'

import {
	Button,
	Card,
	Table,
	Header,
	Divider,
	Popup,
	List,
	Label
} from 'semantic-ui-react'

import ScopeComment from '../../../common/scope_comment/ScopeComment.jsx'
import TasksScoped from '../../../common/tasks_scoped/TasksScoped.jsx'
import Creds from '../../../common/creds/Creds.jsx'


class IPEntryLine extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (!_.isEqual(nextProps['ip'], this.props['ip']));
	}

	render() {
		const { ip, project_uuid, deleteIP, onCommentSubmit } = this.props;
		const verbose_host_link = '/project/' + project_uuid + '/ip/' + ip.ip_address;

		const footer = (
			<div>
		        <TasksScoped
		        	target={ip.ip_address}
		        	tasks={ip.tasks}
	        	/>

	            <a onClick={() => window.open("https://google.com/search?q=site:" + ip.ip_address, Math.random().toString(36).substring(7))}>
					<Button basic size="tiny">
						G Dork
					</Button>
	            </a>

	            <a onClick={() => window.open(verbose_host_link, Math.random().toString(36).substring(7), 'width=850,height=700')}>
					<Button basic size="tiny">
						Verbose
					</Button>
	            </a>

				<Button basic color="red" size="tiny" onClick={deleteIP}>
					Delete
				</Button>
			</div>
		);
		const ports = _.map(ip.scans.sort((a, b) => {
			if (a["port_number"] > b["port_number"]) return 1;
			if (a["port_number"] < b["port_number"]) return -1;
			return 0;
		}), (x) => {
			return (
				<Table.Row key={x.scan_id + '_' + x.port_number}>
					<Table.Cell>{x.port_number}</Table.Cell>
					<Table.Cell>{x.protocol}</Table.Cell>
					<Table.Cell width={10}>{x.banner}</Table.Cell>
				</Table.Row>
			)
		});

		let hostnames = ip.hostnames;
		let hostnames_view = null;
		
		if (hostnames) {
			let hostnames_list_items = hostnames.map((x) => {
				return <List.Item key={x.host_id}>{x.hostname}</List.Item>;
			});

			hostnames_view = (
				<Popup 
					trigger={<Label as="a">Hosts<Label.Detail>{hostnames.length}</Label.Detail></Label>}
					content={
						<List bulleted>
							{hostnames_list_items}
						</List>
					}
					position="right center"
				/>
			);
		}

		let files_by_statuses = {
			'2xx': 0,
			'3xx': 0,
			'4xx': 0,
			'5xx': 0
		}

		for (let port_number of Object.keys(ip.files)) {
			for (let status_code of Object.keys(ip.files[port_number])) {
				if (Math.floor(status_code / 100) === 3) {
					files_by_statuses['3xx'] += ip.files[port_number][status_code];
				}
				else if (Math.floor(status_code / 100) === 4) {
					files_by_statuses['4xx'] += ip.files[port_number][status_code];
				}
				else if (Math.floor(status_code / 100) === 5) {
					files_by_statuses['5xx'] += ip.files[port_number][status_code];
				}
				else if (Math.floor(status_code / 100) === 2) {
					files_by_statuses['2xx'] += ip.files[port_number][status_code];
				}
			}
		}

		const description = (
			<div>
				<Header>
					{ip.ip_address}
				</Header>
				<Divider/>
				<ScopeComment comment={ip.comment}
						  	  onCommentSubmit={onCommentSubmit} />

				<div style={{"wordBreak": "break-all"}}>
					{hostnames_view}
					<Creds
						scope={ip}
						project_uuid={project_uuid}
					/>
				</div>

				<Divider hidden />
				<List bulleted>
					<List.Item>2xx: <strong>{files_by_statuses['2xx']}</strong></List.Item> 
					<List.Item>3xx: {files_by_statuses['3xx']}</List.Item>
					<List.Item>4xx: {files_by_statuses['4xx']}</List.Item>
					<List.Item>5xx: {files_by_statuses['5xx']}</List.Item>
				</List>

				<Divider hidden />
				<Table basic="very">
					<Table.Body>
						{ports}
					</Table.Body>
				</Table>
			</div>
		)

		return (
			<Card color="blue" fluid>
				<Card.Content description={description} />
				<Card.Content extra>{footer}</Card.Content>
			</Card>	
		)	
	}
}

export default IPEntryLine;