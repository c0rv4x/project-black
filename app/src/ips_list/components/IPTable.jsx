import _ from 'lodash'
import React from 'react'

import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import CredsSocketioEventsEmitter from '../../redux/creds/CredsSocketioEventsEmitter.js'
import IPEntryLine from '../presentational/scope/IPEntryLine.jsx'
import Search from '../../common/search/Search.jsx'

import { Grid, Heading } from 'grommet'


const areasDefault = [
	{ name: 'ip', start: [0, 0], end: [0, 0] },
	{ name: 'comment', start: [1, 0], end: [1, 0] },
	{ name: 'ports', start: [2, 0], end: [2, 0] },
	{ name: 'files', start: [3, 0], end: [3, 0] },
	{ name: 'control', start: [4, 0], end: [4, 0] },
]

class IPTable extends React.Component {

	constructor(props) {
		super(props);

		if (this.props.ips) {
			this.state = {
				shownData: this.props.ips.data,
				offsetPage: this.props.ips.page,
				pageCount: Math.ceil(this.props.ips.selected_ips / this.props.ips.page_size),
				areas: [],
				rows: []
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
		if ((this.props.ips.page !== prevProps.ips.page) || (this.props.ips.page_size !== prevProps.ips.page_size)) {
			this.props.setLoaded(true);
		}

		const { ips } = this.props;
		let rows = [];
		// let areas = JSON.parse(JSON.stringify(areasDefault));
		let areas = [];

		for (let i = 0; i < ips.data.length; i++) {
			const ip = ips.data[i];

			rows.push('auto');
			areas.push({
				name: 'ip_' + ip.ip_id, start: [0, i], end: [0, i]
			});
		}

		this.setState({
			rows: rows,
			areas: areas
		});

		if (this.props.ips.selected_ips !== prevProps.ips.selected_ips) {
			// The amount of ips changed, that means filter was applied, send to 0 page
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
		window.scrollTo(0, 0);
		this.props.setLoaded(false);
		this.props.renewIps(page_number - 1);
	}

	render() {
		const { areas, rows } = this.state;

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
						<Grid
							areas={areas}
							columns={['flex']}
							rows={rows}
							gap='small'
						>
							{ips}
						</Grid>
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
