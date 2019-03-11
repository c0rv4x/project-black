import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import IPEntryLine from '../presentational/scope/IPEntryLine.jsx'
import Search from '../../common/search/Search.jsx'

import { Box, Heading } from 'grommet'

import { requestUpdateIPComment } from '../../redux/ips/actions.js'


class IPTable extends React.Component {

	constructor(props) {
		super(props);

		const { ips } = this.props;

		if (ips) {
			this.state = {
				offsetPage: ips.page,
				pageCount: Math.ceil(ips.selected_ips / ips.page_size)
			}
		}

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);
	}

	commentSubmitted(comment, _id) {
		this.context.store.dispatch(requestUpdateIPComment(this.props.project_uuid, _id, comment));
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));
	}

	componentDidUpdate(prevProps) {
		const { ips } = this.props;

		if (ips.selected_ips !== prevProps.ips.selected_ips) {
			// The amount of ips changed, that means filter was applied, send to 0 page
			this.setState({
				offsetPage: 0,
				pageCount: Math.ceil(ips.selected_ips / ips.page_size)
			});
		}
		else {
			this.setState({
				pageCount: Math.ceil(ips.selected_ips / ips.page_size)
			});
		}
	}

	handlePageClick(page_number) {
		window.scrollTo(0, 0);
		setTimeout(() => {
			this.props.renewIps(page_number - 1);
		}, 100);
	}

	render() {
		const { ips, project_uuid, applyFilters, deleteScope } = this.props;
		const ipsList = ips.data;

		const ipsLines = _.map(ipsList, (x) => {
			return (
				<IPEntryLine
					key={project_uuid + '-' + x.ip_id} 
					ip={x}
					project_uuid={project_uuid}
					onCommentSubmit={(value) => this.commentSubmitted(value, x.ip_id)}
					deleteIP={() => deleteScope(x.ip_id)}
				/>
			);
		});

		return (
			<div>
				<Search filters={ips.filters} applyFilters={applyFilters} />
				<br />
				{ipsList.length === 0 && ips.loaded && 
					<Heading level="2">No data found.</Heading>
				}
				{(ipsList.length !== 0 || !ips.loaded) &&
					<div>
						<Box
							gap='small'
						>
							{ipsLines}
						</Box>
						<br />
						<ReactPaginate
							pageNumber={ips.page}
							pageCount={this.state.pageCount}
							clickHandler={this.handlePageClick}
						/>
					</div>
				}
			</div>
		)
	}
}

IPTable.contextTypes = {
    store: PropTypes.object
}

export default IPTable;
