import _ from 'lodash'
import React from 'react'

import Search from '../../common/search/Search.jsx'
import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import HostsEntryLine from '../presentational/HostsEntryLine.jsx'

import { Grid, Container, Header } from 'semantic-ui-react'

class HostsTable extends React.Component {

	constructor(props) {
		super(props);

		if (this.props.hosts) {
			this.state = {
				shownData: this.props.hosts.data,
				offsetPage: this.props.hosts.page,
				pageCount: Math.ceil(this.props.hosts.total_db_hosts / this.props.hosts.page_size)
			}
		}

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if ((nextProps.hosts.page !== this.props.hosts.page) || (nextProps.hosts.page_size !== this.props.hosts.page_size)) {
			this.props.triggerSetLoaded(true);
		}

		if (nextProps.hosts.selected_hosts !== this.props.hosts.selected_hosts) {
			this.setState({
				shownData: nextProps.hosts.data,
				offsetPage: 0,
				pageCount: Math.ceil(nextProps.hosts.selected_hosts / this.props.hosts.page_size)
			});
		}
		else {
			this.setState({
				shownData: nextProps.hosts.data,
				pageCount: Math.ceil(nextProps.hosts.selected_hosts / this.props.hosts.page_size)
			});
		}
	}

	handlePageClick(page_number) {
		this.props.triggerSetLoaded(false);
		window.scrollTo(0, 0);
		this.props.renewHosts(page_number - 1, this.props.hosts.page_size);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));
	}

	commentSubmitted(comment, _id) {
		this.props.requestUpdateHost(comment, _id);
	}

	render() {
		const scopes = _.map(this.state.shownData, (x) => {
			return <HostsEntryLine key={x.host_id}
								   project_uuid={this.props.project_uuid}
								   host={x} 
								   onCommentSubmit={(value) => this.commentSubmitted(value, x.host_id)}
								   deleteScope={() => this.props.deleteScope(x.host_id)} />
		});

		let hosts_group = [];

		let columns = 3;
		for (var i = 0; i < scopes.length + columns - 1; i += columns) {
			let hosts_slice = scopes.slice(i, Math.min(scopes.length, i + columns));

			let host_key_sum = '';
			let hosts_slice_formatted = hosts_slice.map((host) => {
				host_key_sum += host.key + ',';

				return (
					<Grid.Column key={host.key + '__'}>
						{host}
					</Grid.Column>
				);
			});

			hosts_group = hosts_group.concat(
				<Grid.Row stretched key={host_key_sum}>
					{hosts_slice_formatted}
				</Grid.Row>
			);
		}

		return (
			<div>
				<Search applyFilters={this.props.applyFilters} />
				<br />
				{this.props.hosts.data.length === 0 && this.props.hosts.loaded && 
					<Header as='h2'>No data found.</Header>
				}
				{(this.props.hosts.data.length !== 0 || !this.props.hosts.loaded) &&
					<div>
						<Container>
							<Grid columns={columns}>
								{hosts_group}
							</Grid>
						</Container>
						<br />
						<ReactPaginate
							pageNumber={this.props.hosts.page}
							pageCount={this.state.pageCount}
							clickHandler={this.handlePageClick} />
					</div>
				}
			</div>
		)
	}

}

export default HostsTable;
