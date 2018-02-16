import _ from 'lodash'
import React from 'react'

import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import TablesAccumulator from './TablesAccumulator.jsx'


class TableUpdater extends React.Component {

	constructor(props) {
		super(props);

		this.ipsEmitter = new IPsSocketioEventsEmitter();
		this.hostsEmitter = new HostsSocketioEventsEmitter();

		this.renewHosts = this.renewHosts.bind(this);
		this.renewIps = this.renewIps.bind(this);
		this.changePage = this.changePage.bind(this);
		this.getVisibleScopes = this.getVisibleScopes.bind(this);

		this.pageSize = 4;
		this.pageNumberIp = 0;
		this.pageNumberHost = 0;
		this.pageType = 'ip';
	}

	componentWillReceiveProps(nextProps) {
		var { hosts, filters } = nextProps;

		if ((hosts.update_needed === true) || (!_.isEqual(filters, this.props.filters))) {
			// this.setLoading(true);
			this.renewHosts(this.pageNumberHost, filters);
			this.renewIps(this.pageNumberIp, filters);
		}

		// if (this.state.loading) {
		// 	this.setLoading(false);
		// }
	}

	renewHosts(page=this.pageNumberHost, filters=this.props.filters) {
		var newFilters = filters;
		newFilters['files'] = '%';
		this.hostsEmitter.requestRenewHosts(this.props.project_uuid, newFilters, page, this.pageSize);
	}

	renewIps(page=this.pageNumberIp, filters=this.props.filters) {
		var newFilters = filters;
		newFilters['files'] = '%';		
		this.ipsEmitter.requestRenewIPs(this.props.project_uuid, newFilters, page, this.pageSize);
	}

	getVisibleScopes() {
		let { ips, hosts } = this.props;

		if (this.pageType == 'ip') {
			if (ips.data.length >= this.pageSize) {
				return {
					ips: ips.data.slice(0, this.pageSize),
					hosts: []
				};				
			}
			else {
				this.pageType = 'ip/host';

				let hosts_to_select = this.pageSize - ips.data.length + 1;
				return {
					ips: ips.data,
					hosts: hosts.data.slice(0, hosts_to_select)
				}				
			}
		}
		else if (this.pageType == 'ip/host') {
			let hosts_to_select = this.pageSize - ips.data.length + 1;
			return {
				ips: ips.data,
				hosts: hosts.data.slice(0, hosts_to_select)
			}			
		}
		else {
			if (hosts.data.length >= this.pageSize) {
				return {
					ips: [],
					hosts: hosts.data.slice(0, this.pageSize)
				}				
			}
			else {
				this.pageType = 'ip/host';

				let hosts_to_select = this.pageSize - ips.data.length + 1;
				return {
					ips: ips.data,
					hosts: hosts.data.slice(0, hosts_to_select)
				}					
			}
		}
	}

	changePage(pageNumberUnmodified) {
		var pageNumber = pageNumberUnmodified - 1;

		const ipPages = Math.ceil(this.props.ips.selected_ips / this.pageSize);
		const hostPages = Math.ceil(this.props.hosts.selected_hosts / this.pageSize);

		if (ipPages > pageNumber) {
			this.pageType = 'ip';

			this.pageNumberIp = pageNumber;
			this.renewIps();
		}
		else if (ipPages == pageNumber) {
			this.pageType = 'ip/host';

			this.pageNumberIp = pageNumber;
			this.pageNumberHost = 0;
			this.renewIps();
			this.renewHosts();
		}
		else {
			this.pageType = 'host';

			this.pageNumberHost = pageNumber - ipPages;
			this.renewHosts();
		}
	}


	render() {
		let scopes = this.getVisibleScopes();

		scopes.selected = {
			ips: this.props.ips.selected_ips,
			hosts: this.props.hosts.selected_hosts
		}

		return (
			<TablesAccumulator
				applyFilters={this.props.applyFilters}
				ips={scopes.ips}
				hosts={scopes.hosts}
				selected={scopes.selected}
				changePage={this.changePage}
				pageSize={this.pageSize}
			/>
		);
	}

}

export default TableUpdater;