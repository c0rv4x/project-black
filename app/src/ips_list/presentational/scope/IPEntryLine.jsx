import _ from 'lodash'
import React from 'react'

import {
	Button,
	Card,
	Table,
	Header,
	Grid,
	Divider,
	Popup,
	Modal,
	List,
	Label,
	Image
} from 'semantic-ui-react'

import ScopeComment from '../../../common/scope_comment/ScopeComment.jsx'
import TasksScoped from '../../../common/tasks_scoped/TasksScoped.jsx'


class IPEntryLine extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			column: null,
			data: [],
			direction: null,
			inited: false
		};

		this.handleSortClick = this.handleSortClick.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
  		return ((!_.isEqual(nextProps, this.props)) || ((!_.isEqual(nextState, this.state))) || (!this.state.inited));
	}

	componentDidMount() {
		if (!this.state.inited) {
			this.forceUpdate();
		}
	}

	componentDidUpdate(prevProps) {
		if (!this.state.inited) {
			this.setState({
				column: null,
				data: this.props.ip.creds,
				direction: null,				
				inited: true
			});
		}
		else {
			if (prevProps.ip.creds !== this.props.ip.creds) {
				this.setState({
					column: null,
					data: this.props.ip.creds,
					direction: null
				});
			}
		}
	}

	handleSortClick(clickedColumn) {
		const { column, data, direction } = this.state

		if (column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				data: _.sortBy(data, [clickedColumn]),
				direction: 'ascending',
			});
	  
			return
		}
	  
		this.setState({
			data: data.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending',
		})
	}

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

		let hostnames = ip.hostnames.sort((a, b) => {
			if (a.hostname > b.hostname) return 1;
			if (a.hostname < b.hostname) return -1;
			return 0;
		});
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

		let creds_rendered = null;
		if (this.state.data.length) {
			const { column, data, direction } = this.state;

			creds_rendered = (
				<Modal 
					trigger={<Label as="a">Accounts<Label.Detail>{ip.creds.length}</Label.Detail></Label>}
				>
					<Modal.Header>{ip.ip_address}</Modal.Header>
					<Modal.Content>
						<Table sortable>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell
										sorted={column === 'port_number' ? direction : null}
										onClick={() => {this.handleSortClick('port_number')}}
										width={1}
									>
										Port
									</Table.HeaderCell>
									<Table.HeaderCell
										sorted={column === 'service' ? direction : null}
										onClick={() => {this.handleSortClick('service')}}
										width={2}
									>
										Service
									</Table.HeaderCell>
									<Table.HeaderCell
										sorted={column === 'code' ? direction : null}
										onClick={() => {this.handleSortClick('code')}}
										width={1}
									>
										Code
									</Table.HeaderCell>
									<Table.HeaderCell
										sorted={column === 'candidate' ? direction : null}
										onClick={() => {this.handleSortClick('candidate')}}
										width={5}
									>
										Candidate
									</Table.HeaderCell>
									<Table.HeaderCell
										sorted={column === 'size' ? direction : null}
										onClick={() => {this.handleSortClick('size')}}
										width={1}
									>
										Size
									</Table.HeaderCell>
									<Table.HeaderCell
										sorted={column === 'mesg' ? direction : null}
										onClick={() => {this.handleSortClick('mesg')}}
										width={6}
									>
										Message
									</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{_.map(data, ({ id, target, port_number, service, code, candidate, size, mesg}) => {
									return (
										<Table.Row key={"cred_" + target + "_" + id}>
											<Table.Cell>{port_number}</Table.Cell>
											<Table.Cell>{service}</Table.Cell>
											<Table.Cell>{code}</Table.Cell>
											<Table.Cell>{candidate}</Table.Cell>
											<Table.Cell>{size}</Table.Cell>
											<Table.Cell>{mesg}</Table.Cell>
										</Table.Row>
									);
								})}
							</Table.Body>
						</Table>
					</Modal.Content>
				</Modal>
			);
		}

		let files_by_statuses = {
			'2xx': [],
			'3xx': [],
			'4xx': [],
			'5xx': []
		}

		for (var file of ip.files) {
			if (Math.floor(file.status_code / 100) === 3) {
				files_by_statuses['3xx'].push(file);
			}
			else if (Math.floor(file.status_code / 100) === 4) {
				files_by_statuses['4xx'].push(file);
			}
			else if (Math.floor(file.status_code / 100) === 5) {
				files_by_statuses['5xx'].push(file);
			}
			else if (Math.floor(file.status_code / 100) === 2) {
				files_by_statuses['2xx'].push(file);
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

				<div style={{"wordBreak": "break-all"}}>{hostnames_view}{creds_rendered}</div>

				<Divider hidden />
				<List bulleted>
					<List.Item>2xx: <strong>{files_by_statuses['2xx'].length}</strong></List.Item> 
					<List.Item>3xx: {files_by_statuses['3xx'].length}</List.Item>
					<List.Item>4xx: {files_by_statuses['4xx'].length}</List.Item>
					<List.Item>5xx: {files_by_statuses['5xx'].length}</List.Item>
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