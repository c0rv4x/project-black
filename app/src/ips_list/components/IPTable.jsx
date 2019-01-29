import _ from 'lodash'
import React from 'react'

import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import CredsSocketioEventsEmitter from '../../redux/creds/CredsSocketioEventsEmitter.js'
import IPEntryLine from '../presentational/scope/IPEntryLine.jsx'
import Search from '../../common/search/Search.jsx'

import { Box, Heading } from 'grommet'


class IPTable extends React.Component {

	constructor(props) {
		super(props);

		const { ips } = this.props;

		if (ips) {
			this.state = {
				shownData: ips.data,
				offsetPage: ips.page,
				pageCount: Math.ceil(ips.selected_ips / ips.page_size)
			}
		}

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);
	}

	componentDidMount() {
		this.ipsEmitter = new IPsSocketioEventsEmitter();
		this.credsEmitter = new CredsSocketioEventsEmitter();
	}

	commentSubmitted(comment, _id) {
		this.ipsEmitter.requestUpdateIP(comment, _id, this.props.project_uuid, 'ip_address');
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));
	}

	componentDidUpdate(prevProps) {
		const { ips } = this.props;

		if ((ips.page !== prevProps.ips.page) || (ips.page_size !== prevProps.ips.page_size)) {
			this.props.setLoaded(true);
		}

		if (ips.selected_ips !== prevProps.ips.selected_ips) {
			// The amount of ips changed, that means filter was applied, send to 0 page
			this.setState({
				shownData: ips.data,
				offsetPage: 0,
				pageCount: Math.ceil(ips.selected_ips / ips.page_size)
			});
		}
		else {
			this.setState({
				shownData: ips.data,
				pageCount: Math.ceil(ips.selected_ips / ips.page_size)
			});
		}
	}

	handlePageClick(page_number) {
		window.scrollTo(0, 0);
		this.props.setLoaded(false);
		setTimeout(() => {
			this.props.renewIps(page_number - 1);
		}, 100);
	}

	render() {
		const ips = _.map(this.state.shownData, (x) => {
			return <IPEntryLine key={x.ip_id} 
								ip={x}
								project_uuid={this.props.project_uuid}
								onCommentSubmit={(value) => this.commentSubmitted(value, x.ip_id)}
								deleteIP={() => this.props.deleteScope(x.ip_id)} />
		});

		return (
			<div>
				<Search applyFilters={this.props.applyFilters} />
				<br />
				{this.props.ips.data.length === 0 && this.props.ips.loaded && 
					<Heading level="2">No data found.</Heading>
				}
				{(this.props.ips.data.length !== 0 || !this.props.ips.loaded) &&
					<div>
						<Box
							gap='small'
						>
							{ips}
						</Box>
						<br />
						<ReactPaginate
							pageNumber={this.props.ips.page}
							pageCount={this.state.pageCount}
							clickHandler={this.handlePageClick}
						/>
					</div>
				}
			</div>
		)
	}
}

export default IPTable;
