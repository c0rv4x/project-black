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

		this.page_size = 4;
		this.page_number_ip = 0;
		this.page_number_host = 0;
		this.page_type = 'ip';
	}

	renewHosts(page=this.page_number_host, filters={}) {
		this.hostsEmitter.requestRenewHosts(this.props.project_uuid, filters, page, this.page_size);
	}

	renewIps(ip_page=this.page_number_ip, filters={}) {
		this.ipsEmitter.requestRenewIPs(this.props.project.project_uuid, filters, ip_page, this.page_size);
	}

	getVisibleScopes() {
		let { ips, hosts } = this.props;

		if (this.page_type == 'ip') {
			if (ips.data.length >= this.page_size) {
				return {
					ips: ips.data.slice(0, this.page_size),
					hosts: []
				};				
			}
			else {
				this.page_type = 'ip/host';

				let hosts_to_select = this.page_size - ips.data.length + 1;
				return {
					ips: ips.data,
					hosts: hosts.data.slice(0, hosts_to_select)
				}				
			}
		}
		else if (this.page_type == 'ip/host') {
			let hosts_to_select = this.page_size - ips.data.length + 1;
			return {
				ips: ips.data,
				hosts: hosts.data.slice(0, hosts_to_select)
			}			
		}
		else {
			if (hosts.data.length >= this.page_size) {
				return {
					ips: [],
					hosts: hosts.data.slice(0, this.page_size)
				}				
			}
			else {
				this.page_type = 'ip/host';

				let hosts_to_select = this.page_size - ips.data.length + 1;
				return {
					ips: ips.data,
					hosts: hosts.data.slice(0, hosts_to_select)
				}					
			}
		}
	}

	// prevPage() {
	// 	if (this.page_type == 'ip') {
	// 		this.page_number_ip -= 1;
	// 		this.renewHosts();
	// 	}
	// 	else {
	// 		this.page_number_host += 1;
	// 		this.renewIps();
	// 	}
	// }

	// nextPage() {
	// 	if (this.page_type == 'host') {
	// 		this.page_number_host += 1;
	// 		this.renewHosts();
	// 	}
	// 	else {
	// 		this.page_number_ip += 1;
	// 		this.renewIps();
	// 	}
	// }

	changePage(pageNumber) {
		const ipPages = Math.ceil(this.props.ips.selected_ips / this.page_size);
		const hostPages = Math.ceil(this.props.hosts.selected_hosts / this.page_size);

		if (ipPages > pageNumber) {
			this.page_type = 'ip';

			this.page_number_ip = pageNumber;
			this.requestIps();
		}
		else if (ipPages == pageNumber) {
			this.page_type = 'ip/host';

			this.page_number_ip = pageNumber;
			this.page_number_host = 0;
			this.requestIps();
			this.reqeustHosts();
		}
		else {
			this.page_type = 'host';

			this.page_number_host = pageNumber - ipPages;
			thos.requestIps();
		}
	}


	render() {
		let scopes = this.getVisibleScopes();
		console.log(scopes);

		return (
			<TablesAccumulator 
				ips={scopes.ips}
				hosts={scopes.hosts}
				changePage={this.changePage}
				pageSize={this.pageSize}
			/>
		);
	}

}

export default TableUpdater;