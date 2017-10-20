import _ from 'lodash'
import React from 'react'
import Notifications from 'react-notification-system-redux'

import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'
import IPEntryLine from '../presentational/scope/IPEntryLine.jsx'
import Search from './Search.jsx'

import { Card } from 'semantic-ui-react'


class IPTable extends React.Component {

	constructor(props) {
		super(props);

		this.limitPerPage = 12;

		if (this.props.ips) {
			let pageCount = Math.ceil(this.props.ips.length / this.limitPerPage);

			this.state = {
				shownData: this.props.ips.slice(0, 0 + this.limitPerPage),
				offsetPage: 0,
				pageCount: pageCount
			}
		}

		this.scopesEmitter = new ScopesSocketioEventsEmitter();

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);

		this.page_inited = false;
	}

	commentSubmitted(comment, _id) {
		this.scopesEmitter.requestUpdateScope(comment, _id, this.props.project_uuid);
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log(nextProps, nextState);
		if (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState)) {
				if (this.props.ips.length !== nextProps.ips.length) {
					var diff = nextProps.ips.length - this.props.ips.length;

					if (diff > 0) {
						this.context.store.dispatch(Notifications.info({
							title: 'New IPs',
							message: 'Added ' + String(nextProps.ips.length - this.props.ips.length) + ' IPs.'
						}));					
					}
					else {
						this.context.store.dispatch(Notifications.info({
							title: 'IPs deleted',
							message: 'Deleted ' + String(this.props.ips.length - nextProps.ips.length) + ' IPs.'
						}));					
					}

				}

				return true;
		}
		else {
			return false;
		}
	}

	componentWillReceiveProps(nextProps) {
		var start = this.limitPerPage * this.state.offsetPage;

		this.setState({
			shownData: nextProps.ips.slice(start, start + this.limitPerPage),
			pageCount: Math.ceil(nextProps.ips.length / this.limitPerPage)
		});
	}

	handlePageClick(data) {
		var start = this.limitPerPage * (data - 1);

		this.setState({
			offsetPage: data - 1,
			shownData: this.props.ips.slice(start, start + this.limitPerPage),
		});
	}

	render() {
		const ips = _.map(this.state.shownData, (x) => {
			return <IPEntryLine key={x._id} 
								ip={x}
								project_uuid={this.props.project_uuid}
								onCommentSubmit={(event) => this.commentSubmitted(event.target.value, x._id)}
								deleteScope={() => this.props.deleteScope(x._id)} />
		});

		return (
			<div>
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

IPTable.contextTypes = {
	store: React.PropTypes.object
}

export default IPTable;
