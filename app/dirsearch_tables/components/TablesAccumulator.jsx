import _ from 'lodash'
import React from 'react'
import Notifications from 'react-notification-system-redux'

import ReactPaginate from '../../common/paginate/ReactPaginate.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import Search from '../../common/search/Search.jsx'

import { Card, Header, Divider } from 'semantic-ui-react'

import DirsearchTable from './DirsearchTable.jsx'


class TablesAccumulator extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			pageCount: Math.ceil((this.props.selected.ips + this.props.selected.hosts) / this.props.pageSize)
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			pageCount: Math.ceil((nextProps.selected.ips + nextProps.selected.hosts) / nextProps.pageSize)
		});
	}

	render() {
		const { ips, hosts, project_name, applyFilters, changePage } = this.props;

		let tables = [];

		for (var each_ip of ips) {
			for (var each_port of each_ip.scans) {
				let files = each_ip.files.filter((x) => {
					return x.port_number == each_port.port_number;
				});

				tables.push(
					<DirsearchTable key={each_ip.ip_id + "_" + each_port.scan_id} 
									target={each_ip.ip_address}
									port_number={each_port.port_number}
									files={files}/>
				);				
			}
		}

		for (var each_host of hosts) {
			let ports = new Set();

			for (var each_ip_address of each_host.ip_addresses) {				
				for (var each_port of each_ip_address.scans) {
					ports.add(each_port.port_number);
				}
			}

			for (var port_number of ports) {
				let files = each_host.files.filter((x) => {
					return x.port_number == port_number;
				});

				tables.push(
					<DirsearchTable key={each_host.host_id + "_" + port_number} 
									target={each_host.hostname}
									port_number={port_number}
									files={files}/>
				);
			}
		}

		return (
			<div>
				<Divider hidden />
				<Header as="h2">{project_name}</Header>
				<Search applyFilters={applyFilters} />
				<br />
					{tables}
				<br />
				<ReactPaginate pageCount={this.state.pageCount}
							   clickHandler={changePage} />
			</div>			
		)
	}
}

export default TablesAccumulator;
