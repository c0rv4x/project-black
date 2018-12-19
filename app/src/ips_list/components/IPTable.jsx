import _ from 'lodash'
import React from 'react'

import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import CredsSocketioEventsEmitter from '../../redux/creds/CredsSocketioEventsEmitter.js'
import IPEntryLine from '../presentational/scope/IPEntryLine.jsx'
import Search from '../../common/search/Search.jsx'

import { Grid, Container, Header, Segment } from 'semantic-ui-react'


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
		this.credsEmitter = new CredsSocketioEventsEmitter();

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);
	}

	commentSubmitted(comment, _id) {
		this.ipsEmitter.requestUpdateIP(comment, _id, this.props.project_uuid, 'ip_address');
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));
	}

	componentDidUpdate(prevProps) {
		if ((this.props.ips.page !== prevProps.ips.page) || (this.props.ips.page_size !== prevProps.ips.page_size)) {
			this.props.setLoaded(true);
		}

		if (this.props.ips.selected_ips !== prevProps.ips.selected_ips) {
			this.setState({
				shownData: this.props.ips.data,
				offsetPage: 0,
				pageCount: Math.ceil(this.props.ips.selected_ips / this.props.ips.page_size)
			});
		}
		else {
			this.setState({
				shownData: this.props.ips.data,
				pageCount: Math.ceil(this.props.ips.selected_ips / this.props.ips.page_size)
			});
		}
	}

	handlePageClick(page_number) {
		this.props.setLoaded(false);
		window.scrollTo(0, 0);
		this.props.renewIps(page_number - 1);
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
					<Header as='h2'>No data found.</Header>
				}
				{(this.props.ips.data.length !== 0 || !this.props.ips.loaded) &&
					<div>
						<Container>
							<Segment.Group>
								{ips}
							</Segment.Group>
						</Container>
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
