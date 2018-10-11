import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types';

import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import FilesSocketioEventsEmitter from '../../redux/files/FilesSocketioEventsEmitter.js'
import TablesAccumulator from './TablesAccumulator.jsx'
import { setLoaded as setLoadedIPs } from '../../redux/ips/actions.js'
import { setLoaded as setLoadedHosts } from '../../redux/hosts/actions.js'
import { emptyFiles } from '../../redux/files/actions.js'

import { Loader, Dimmer } from 'semantic-ui-react'


class MainAccumulatorUpdater extends React.Component {

	constructor(props) {
		super(props);

		this.ipsEmitter = new IPsSocketioEventsEmitter();
		this.hostsEmitter = new HostsSocketioEventsEmitter();
		this.filesEmitter = new FilesSocketioEventsEmitter();

		this.renewHosts = this.renewHosts.bind(this);
		this.renewIps = this.renewIps.bind(this);
		this.changePage = this.changePage.bind(this);
		this.getVisibleScopes = this.getVisibleScopes.bind(this);

		this.pageSize = 4;
		this.pageNumberIp = 0;
		this.pageNumberHost = 0;
		this.pageType = 'ip';

		this.triggerSetLoadedIPs = this.triggerSetLoadedIPs.bind(this);
		this.triggerSetLoadedHosts = this.triggerSetLoadedHosts.bind(this);
		this.getFilesIps = this.getFilesIps.bind(this);
		this.getFilesHosts = this.getFilesHosts.bind(this);
		this.renewFilesStatsHosts = this.renewFilesStatsHosts.bind(this);
		this.renewFilesStatsIps = this.renewFilesStatsIps.bind(this);
		this.setFilesEmpty = this.setFilesEmpty.bind(this);

		if (this.props.ips.data) {
			this.renewFilesStatsIps();
		}

		if (this.props.hosts.data) {
			this.renewFilesStatsHosts();
		}		
	}

	triggerSetLoadedIPs(value) {
		this.context.store.dispatch(setLoadedIPs({
			'status': 'success',
			'value': value,
			'project_uuid': String(this.props.project_uuid)
		}, String(this.props.project_uuid)));
	}

	triggerSetLoadedHosts(value) {
		this.context.store.dispatch(setLoadedHosts({
			'status': 'success',
			'value': value,
			'project_uuid': String(this.props.project_uuid)
		}, String(this.props.project_uuid)));
	}

	componentDidUpdate(prevProps) {
		var { ips, hosts, filters } = this.props;

		if (hosts.update_needed) {
			if (hosts.loaded) {
				this.triggerSetLoadedHosts(false);
				setTimeout(() => {
					this.renewHosts(this.pageNumberHost, filters, this.pageSize);
				}, 100);
			}
		}
		if (ips.update_needed) {
			if (ips.loaded) {
				this.triggerSetLoadedIPs(false);
				setTimeout(() => {
					this.renewIps(this.pageNumberIp, filters, this.pageSize);
				}, 100);
			}
		}

		if (!_.isEqual(filters, prevProps.filters)) {
			this.setFilesEmpty();

			this.triggerSetLoadedIPs(false);
			this.triggerSetLoadedHosts(false);

			setTimeout(() => {
				this.renewHosts(this.pageNumberHost, filters, this.pageSize);
				this.renewIps(this.pageNumberIp, filters, this.pageSize);
			}, 100);
		}

		if (!_.isEqual(ips.data, prevProps.ips.data)) {
			this.renewFilesStatsIps();
		}
		 
		if (!_.isEqual(hosts.data, prevProps.hosts.data)) {
			this.renewFilesStatsHosts();
		}
	}

	setFilesEmpty() {
		this.context.store.dispatch(emptyFiles({
			'project_uuid': String(this.props.project_uuid)
		}, String(this.props.project_uuid)));		
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));
	}

	renewHosts(page=this.pageNumberHost, filters=this.props.filters, pageSize=this.pageSize) {
		var newFilters = filters;
		if (!filters['files']) {
			newFilters['files'] = ['%'];
		}

		this.hostsEmitter.requestRenewHosts(this.props.project_uuid, newFilters, page, this.pageSize);
	}

	renewIps(page=this.pageNumberIp, filters=this.props.filters, pageSize=this.pageSize) {
		var newFilters = filters;
		if (!filters['files']) {
			newFilters['files'] = ['%'];
		}

		this.ipsEmitter.requestRenewIPs(this.props.project_uuid, newFilters, page, this.pageSize);
	}

	renewFilesStatsIps(ips=this.props.ips.data) {
		this.filesEmitter.requestStatsIPs(this.props.project_uuid, ips.map((ip) => {return ip.ip_id}));
	}

	renewFilesStatsHosts(hosts=this.props.hosts.data) {
		this.filesEmitter.requestStatsHost(this.props.project_uuid, hosts.map((host) => {return host.host_id}));
	}

	getFilesHosts(host, port_number, limit, offset, filters) {
		this.filesEmitter.requestFilesHosts(
			this.props.project_uuid,
			host,
			port_number,
			limit,
			offset,
			filters
		);
	}

	getFilesIps(ip, port_number, limit, offset, filters) {
		this.filesEmitter.requestFilesIps(
			this.props.project_uuid,
			ip,
			port_number,
			limit,
			offset,
			filters
		);
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
			this.triggerSetLoadedIPs(false);

			this.pageNumberIp = pageNumber;
			this.renewIps();
		}
		else if (ipPages == pageNumber) {
			this.pageType = 'ip/host';
			this.triggerSetLoadedIPs(false);
			this.triggerSetLoadedHosts(false);

			this.pageNumberIp = pageNumber;
			this.pageNumberHost = 0;
			this.renewIps();
			this.renewHosts();
		}
		else {
			this.pageType = 'host';
			this.triggerSetLoadedHosts(false);

			this.pageNumberHost = pageNumber - ipPages;
			this.renewHosts();
		}

		window.scrollTo(0, 0);
	}


	render() {
		const { files, ips, hosts, applyFilters, project, project_uuid, filters } = this.props;

		let loaded = true;
		
		if      (this.pageType == 'ip')      loaded = ips.loaded
		else if (this.pageType == 'ip/host') loaded = ips.loaded && hosts.loaded
		else if (this.pageType == 'host')    loaded = hosts.loaded;

		let scopes = {};
		if (loaded) {
			scopes = this.getVisibleScopes();

			scopes.selected = {
				ips: ips.selected_ips,
				hosts: hosts.selected_hosts
			}
		}

		else {
			scopes = {
				ips: [],
				hosts: [],
				selected: {
					ips: [],
					hosts: []
				}	
			};
		}

		return (
			<div>
			    <Dimmer active={!loaded}>
					<Loader />
			    </Dimmer>
				<TablesAccumulator
					applyFilters={applyFilters}
					files={files}
					ips={scopes.ips}
					hosts={scopes.hosts}
					selected={scopes.selected}
					project_name={project.project_name}
					project_uuid={project_uuid}
					changePage={(x) => {
						// this.setFilesEmpty();
						this.changePage(x);
					}}
					pageSize={this.pageSize}
					getFilesHosts={(host, port_number, limit, offset) => {
						this.getFilesHosts(host, port_number, limit, offset, filters['files']);
					}}
					getFilesIps={(ip, port_number, limit, offset) => {
						this.getFilesIps(ip, port_number, limit, offset, filters['files']);
					}}
				/>
			</div>
		);
	}
}

MainAccumulatorUpdater.contextTypes = {
    store: PropTypes.object
}

export default MainAccumulatorUpdater;