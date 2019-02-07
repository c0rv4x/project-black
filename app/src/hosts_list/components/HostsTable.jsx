import _ from 'lodash'
import React from 'react'

import Search from '../../common/search/Search.jsx'
import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import HostsEntryLine from '../presentational/HostsEntryLine.jsx'

import { requestUpdateHostComment } from '../../redux/hosts/action.js'

import { Box, Heading } from 'grommet'

class HostsTable extends React.Component {

	constructor(props) {
		super(props);

		const { hosts } = this.props;

		if (hosts) {
			this.state = {
				offsetPage: hosts.page,
				pageCount: Math.ceil(hosts.total_db_hosts / hosts.page_size)
			}
		}

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));
	}

	componentDidUpdate(prevProps) {
		const { hosts } = this.props;

		if (hosts.selected_hosts !== prevProps.hosts.selected_hosts) {
			this.setState({
				offsetPage: 0,
				pageCount: Math.ceil(hosts.selected_hosts / hosts.page_size)
			});
		}
		else {
			this.setState({
				pageCount: Math.ceil(hosts.selected_hosts / hosts.page_size)
			});
		}
	}

	handlePageClick(page_number) {
		window.scrollTo(0, 0);
		this.props.renewHosts(page_number - 1, this.props.hosts.page_size);
	}

	commentSubmitted(comment, _id) {
		this.context.store.dispatch(requestUpdateHostComment(this.props.project_uuid, _id, comment));
	}

	render() {
		const { hosts, project_uuid, deleteScope, applyFilters } = this.props;

		const hostsList = _.map(hosts.data, (x) => {
			return (
				<HostsEntryLine
					key={"hosttable-" + x.host_id} 
					host={x}
					project_uuid={project_uuid}
					onCommentSubmit={(value) => this.commentSubmitted(value, x.host_id)}
					deleteHost={() => deleteScope(x.host_id)}
				/>
			)
		});

		return (
			<div>
				<Search applyFilters={applyFilters} />
				<br />
				{hosts.data.length === 0 && hosts.loaded && 
					<Heading level="2">No data found.</Heading>
				}
				{(hosts.data.length !== 0 || !hosts.loaded) &&
					<div>
						<Box
							gap='small'
						>
							{hostsList}
						</Box>
						<br />
						<ReactPaginate
							pageNumber={hosts.page}
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
