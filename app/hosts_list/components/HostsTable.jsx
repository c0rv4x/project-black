import _ from 'lodash'
import React from 'react'

import Search from './Search.jsx'
import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'
import HostsEntryLine from '../presentational/HostsEntryLine.jsx'

import { Card } from 'semantic-ui-react'

class HostsTable extends React.Component {

	constructor(props) {
		super(props);

		this.limitPerPage = 10;

		if (this.props.hosts) {
			let pageCount = Math.ceil(this.props.hosts.length / this.limitPerPage);

			this.state = {
				shownData: this.props.hosts.slice(0, 0 + this.limitPerPage),
				offsetPage: 0,
				pageCount: pageCount
			}
		}
		else {
			this.state = {
				shownData: [],
				offsetPage: 0,
				pageCount: 0
			}			
		}

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
