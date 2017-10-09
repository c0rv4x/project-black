import _ from 'lodash'
import React from 'react'
import { Table, Button } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Notifications from 'react-notification-system-redux'

import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'
import IPEntryLine from '../presentational/scope/IPEntryLine.jsx'
import Search from './Search.jsx'


class IPTable extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			shownData: [],
			offsetPage: 0,
			pageCount: 0
		}

		this.limitPerPage = 10;

		this.scopesEmitter = new ScopesSocketioEventsEmitter();

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);

		this.page_inited = false;
	}

	commentSubmitted(comment, _id) {
		this.scopesEmitter.requestUpdateScope(comment, _id, this.props.project_uuid);
	}

	shouldComponentUpdate(nextProps, nextState) {
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
		var start = this.limitPerPage * data.selected;

		this.setState({
			offsetPage: data.selected,
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
				<Search onFilterChange={this.props.onFilterChange} />
				{ips}
				<ReactPaginate previousLabel={"prev"}
							   nextLabel={"next"} 
							   pageCount={this.state.pageCount}
		                       breakLabel={<a href="#">...</a>}
							   onPageChange={this.handlePageClick}		                       
		                       breakClassName={"break-me"}							   
		                       containerClassName={"pagination"}
		                       subContainerClassName={"pages pagination"}
		                       activeClassName={"active"} />							   			
			</div>
		)
	}
}

IPTable.contextTypes = {
	store: React.PropTypes.object
}

export default IPTable;
