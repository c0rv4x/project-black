import _ from 'lodash'
import React from 'react'

import Search from '../../common/search/Search.jsx'
import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import HostsEntryLine from '../presentational/HostsEntryLine.jsx'

import { Grid, Heading } from 'grommet'

class HostsTable extends React.Component {

	constructor(props) {
		super(props);

		const { hosts } = this.props;

		if (hosts) {
			let rows = [];
			let areas = [];
	
			for (let i = 0; i < hosts.data.length; i++) {
				const host = hosts.data[i];
	
				rows.push('auto');
				areas.push({
					name: 'host_' + host.host_id, start: [0, i], end: [0, i]
				});
			}

			this.state = {
				shownData: hosts.data,
				offsetPage: hosts.page,
				pageCount: Math.ceil(hosts.total_db_hosts / hosts.page_size),
				areas: areas,
				rows: rows
			}
		}

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));
	}

	componentDidUpdate(prevProps) {
		if ((this.props.hosts.page !== prevProps.hosts.page) || (this.props.hosts.page_size !== prevProps.hosts.page_size)) {
			this.props.triggerSetLoaded(true);
		}

		const { hosts } = this.props;
		let rows = [];
		let areas = [];

		for (let i = 0; i < hosts.data.length; i++) {
			const host = hosts.data[i];

			rows.push('auto');
			areas.push({
				name: 'host_' + host.host_id, start: [0, i], end: [0, i]
			});
		}

		this.setState({
			rows: rows,
			areas: areas
		});

		if (this.props.hosts.selected_hosts !== prevProps.hosts.selected_hosts) {
			this.setState({
				shownData: this.props.hosts.data,
				offsetPage: 0,
				pageCount: Math.ceil(this.props.hosts.selected_hosts / this.props.hosts.page_size)
			});
		}
		else {
			this.setState({
				shownData: this.props.hosts.data,
				pageCount: Math.ceil(this.props.hosts.selected_hosts / this.props.hosts.page_size)
			});
		}
	}

	handlePageClick(page_number) {
		this.props.triggerSetLoaded(false);
		window.scrollTo(0, 0);
		this.props.renewHosts(page_number - 1, this.props.hosts.page_size);
	}

	commentSubmitted(comment, _id) {
		this.props.requestUpdateHost(comment, _id);
	}

	render() {
		const { areas, rows } = this.state;

		const hosts = _.map(this.state.shownData, (x) => {
			return (
				<HostsEntryLine
					key={x.host_id} 
					host={x}
					project_uuid={this.props.project_uuid}
					onCommentSubmit={(value) => this.commentSubmitted(value, x.host_id)}
					deleteHost={() => this.props.deleteScope(x.host_id)}
				/>
			)
		});

		return (
			<div>
				<Search applyFilters={this.props.applyFilters} />
				<br />
				{this.props.hosts.data.length === 0 && this.props.hosts.loaded && 
					<Heading level="2">No data found.</Heading>
				}
				{(this.props.hosts.data.length !== 0 || !this.props.hosts.loaded) &&
					<div>
						<Grid
							areas={areas}
							columns={['flex']}
							rows={rows}
							gap='small'
						>
							{hosts}
						</Grid>
						<br />
						<ReactPaginate
							pageNumber={this.props.hosts.page}
							pageCount={this.state.pageCount}
							clickHandler={this.handlePageClick}
						/>
					</div>
				}
			</div>
		)
	}

}

export default HostsTable;
