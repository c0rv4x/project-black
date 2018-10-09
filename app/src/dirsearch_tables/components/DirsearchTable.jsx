import _ from 'lodash'
import React from 'react'

import { Button, Icon, Label, Table } from 'semantic-ui-react'


class DirsearchTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			current_offset: 0,
			loaded: true
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
	}

	componentDidUpdate(prevProps, prevState) {
		if (!_.isEqual(prevProps.files, this.props.files)) {
			this.setState({
				loaded: true
			});
		}
		else if (prevState.current_offset != this.state.current_offset) {
			this.setState({
				loaded: false
			});
		}
	}

	render() {
		const { files, stats, target_id, target, port_number } = this.props;

		let files_rows = [];
		if (files) {
			for (let each_file of files) {
				let status_code_style = {
					color: null
				};

				if (Math.floor(each_file.status_code / 100) == 2) status_code_style.color = '#22CF22';
				else if (each_file.status_code == 401) status_code_style.color = '#F4DF42';
				else status_code_style.color = '#333333';

				files_rows.push(
					<Table.Row key={each_file.file_id}>
						<Table.Cell style={status_code_style}>{each_file.status_code}</Table.Cell>
						<Table.Cell><a href={each_file.file_path} target="_blank">{each_file.file_name}</a></Table.Cell>
						<Table.Cell>{each_file.content_length}</Table.Cell>
						<Table.Cell>{each_file.special_note}</Table.Cell>
					</Table.Row>
				);
			}
		}

		if (stats.total) {
			return (
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell width={1}>{target + ':' + port_number}</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
							<Table.HeaderCell width={2}>Bytes</Table.HeaderCell>
							<Table.HeaderCell>Redirect to</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{files_rows}
					</Table.Body>
					<Table.Footer fullWidth>
						<Table.Row>
							<Table.HeaderCell colSpan='4'>
								{stats[200] && 
									<Label color="green" size="medium">{stats[200]}x 200</Label>
								}
								{stats[301] && 
									<Label size="medium">{stats[301]}x 301</Label>
								}
								{stats[302] && 
									<Label size="medium">{stats[302]}x 302</Label>
								}																
								{stats[400] && 
									<Label size="medium">{stats[400]}x 400</Label>
								}						
								{stats[401] && 
									<Label color="yellow" size="medium">{stats[401]}x 401</Label>
								}								
								<Label size="medium">{stats.total} files</Label>
								<Button
									disabled={this.state.current_offset >= stats.total}
									floated="right"
									loading={!this.state.loaded}
									size="tiny"
									onClick={() => {
										// TODO: target_id and port_number can be set via the wrapping component
										this.props.requestMore(target_id, port_number, 100, this.state.current_offset);
										this.setState({
											current_offset: this.state.current_offset + 100
										});										
									}}
								>
									<Icon name='plus' /> Load 100
								</Button>								
								<Button
									disabled={this.state.current_offset >= stats.total}
									floated="right"
									loading={!this.state.loaded}
									size="tiny"
									onClick={() => {
										this.props.requestMore(target_id, port_number, 1, this.state.current_offset);
										this.setState({
											current_offset: this.state.current_offset + 1
										});										
									}}
								>
									<Icon name='plus' /> Load 1
								</Button>								
							</Table.HeaderCell>
						</Table.Row>
					</Table.Footer>					
				</Table>
			)
		}
		else {
			return <span></span>
		}
	}
}

export default DirsearchTable;