import _ from 'lodash'
import React from 'react'
import { Table, Button } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'

import Search from './Search.jsx'
import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'
import HostsEntryLine from '../presentational/HostsEntryLine.jsx'


class HostsTable extends React.Component {

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
	}

	componentWillReceiveProps(nextProps) {
		var start = this.limitPerPage * this.state.offsetPage;

		this.setState({
			shownData: nextProps.scopes.slice(start, start + this.limitPerPage),
			pageCount: Math.ceil(nextProps.scopes.length / this.limitPerPage)
		});
	}	

	handlePageClick(data) {
		var start = this.limitPerPage * data.selected;

		this.setState({
			offsetPage: data.selected,
			shownData: this.props.scopes.slice(start, start + this.limitPerPage),
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));
	}

	commentSubmitted(comment, _id) {
		this.scopesEmitter.requestUpdateScope(comment, _id);
	}

	render() {
		const scopes = _.map(this.state.shownData, (x) => {
			return <HostsEntryLine key={x._id}
								   project={this.props.project}
								   host={x} 
								   onCommentSubmit={(event) => this.commentSubmitted(event.target.value, x._id)}
								   deleteScope={() => this.props.deleteScope(x._id)} />
		});

		return (
			<div>
				<Search onFilterChange={this.props.onFilterChange} />
				<br />
				{scopes}
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

export default HostsTable;
