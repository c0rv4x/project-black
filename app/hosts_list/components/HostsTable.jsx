import _ from 'lodash'
import React from 'react'

import Search from '../../common/search/Search.jsx'
import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import HostsEntryLine from '../presentational/HostsEntryLine.jsx'

import { Card } from 'semantic-ui-react'

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
			this.props.setLoading(false);
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
		this.props.renewHosts(page_number - 1, this.props.hosts.page_size);
		this.props.setLoading(true);
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

		return (
			<div>
				<Search applyFilters={this.props.applyFilters} />
				<br />
				<Card.Group>
					{scopes}
				</Card.Group>
				<br />
				<ReactPaginate pageCount={this.state.pageCount}
							   clickHandler={this.handlePageClick} />	
			</div>
		)
	}

}

export default HostsTable;
