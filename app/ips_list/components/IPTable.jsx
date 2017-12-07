import _ from 'lodash'
import React from 'react'
import Notifications from 'react-notification-system-redux'

import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import IPEntryLine from '../presentational/scope/IPEntryLine.jsx'
import Search from './Search.jsx'

import { Card } from 'semantic-ui-react'


class IPTable extends React.Component {

	constructor(props) {
		super(props);

		if (this.props.ips) {
			this.state = {
				shownData: this.props.ips.data,
				offsetPage: this.props.ips.page,
				pageCount: Math.ceil(this.props.ips.selected_ips / this.props.ips.page_size)
			}
		}

		this.ipsEmitter = new IPsSocketioEventsEmitter();

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);
	}

	commentSubmitted(comment, _id) {
		this.ipsEmitter.requestUpdateIP(comment, _id, this.props.project_uuid, 'ip_address');
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));
	}

	componentWillReceiveProps(nextProps) {
		if ((nextProps.ips.page !== this.props.ips.page) || (nextProps.ips.page_size !== this.props.ips.page_size)) {
			this.props.setLoading(false);
		}

		let start = this.limitPerPage * this.state.offsetPage;

		this.setState({
			shownData: nextProps.ips.data,
			pageCount: Math.ceil(nextProps.ips.selected_ips / nextProps.ips.page_size)
		});
	}

	handlePageClick(page_number) {
		this.props.renewIps(page_number - 1);
		this.props.setLoading(true);
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
				<Card.Group>
					{ips}
				</Card.Group>
				<br />
				<ReactPaginate pageCount={this.state.pageCount}
							   clickHandler={this.handlePageClick} />
			</div>
		)
	}
}

export default IPTable;
