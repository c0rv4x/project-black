import _ from 'lodash'
import React from 'react'
import { Table, Button } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'

import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'
import ScopeEntryLine from '../presentational/scope/ScopeEntryLine.jsx'


class ScopeTable extends React.Component {

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

	commentSubmitted(comment, _id) {
		this.scopesEmitter.requestUpdateScope(comment, _id);
	}

	componentWillReceiveProps(nextProps) {
		var start = this.limitPerPage * this.state.offsetPage;

		this.setState({
			shownData: this.props.scopes.slice(start, start + this.limitPerPage),
			pageCount: Math.ceil(this.props.scopes.length / this.limitPerPage)
		});
	}

	handlePageClick(data) {
		var start = this.limitPerPage * data.selected;

		this.setState({
			offsetPage: data.selected,
			shownData: this.props.scopes.slice(start, start + this.limitPerPage),
		});
	}

	render() {
		const scopes = _.map(this.state.shownData, (x) => {
			return <ScopeEntryLine key={x._id} 
								   scope={x} 
								   onCommentSubmit={(event) => this.commentSubmitted(event.target.value, x._id)}
								   deleteScope={() => this.props.deleteScope(x._id)}

								   scans={_.filter(this.props.scans, (y) => {
								   	return y.target == x.ip_address;
								   })}/>
		});

		return (
			<div>
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

export default ScopeTable;
