import _ from 'lodash'
import React from 'react'
import Notifications from 'react-notification-system-redux'

import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import IPEntryLine from '../presentational/scope/IPEntryLine.jsx'
import Search from '../../common/search/Search.jsx'

import { Card, Grid, Container } from 'semantic-ui-react'


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

		if (nextProps.ips.selected_ips !== this.props.ips.selected_ips) {
			this.setState({
				shownData: nextProps.ips.data,
				offsetPage: 0,
				pageCount: Math.ceil(nextProps.ips.selected_ips / this.props.ips.page_size)
			});
		}
		else {
			this.setState({
				shownData: nextProps.ips.data,
				pageCount: Math.ceil(nextProps.ips.selected_ips / this.props.ips.page_size)
			});
		}
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

		let ips_groups = [];

		let columns = 3;
		for (var i = 0; i < ips.length + columns - 1; i += columns) {
			console.warn("IPtable:78", "not sure if this works ok, double check plz");
			let ips_slice = ips.slice(i, Math.min(ips.length, i + columns));

			let ip_key_sum = '';
			let ips_slice_formatted = ips_slice.map((ip) => {
				ip_key_sum += ip.key + ',';

				return (
					<Grid.Column key={ip.key + '__'}>
						{ip}
					</Grid.Column>
				);
			});

			ips_groups = ips_groups.concat(
				<Grid.Row stretched key={ip_key_sum}>
					{ips_slice_formatted}
				</Grid.Row>
			);
		}

		return (
			<div>
				<Search applyFilters={this.props.applyFilters} />
				<br />
				<Container>
					<Grid columns={columns}>
						{ips_groups}
					</Grid>
				</Container>
				<br />
				<ReactPaginate pageCount={this.state.pageCount}
							   clickHandler={this.handlePageClick} />
			</div>
		)
	}
}

export default IPTable;
