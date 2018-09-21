import _ from 'lodash'
import React from 'react'

import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import TablesAccumulator from './TablesAccumulator.jsx'
import { setLoaded as setLoadedIPs } from '../../redux/ips/actions.js'
import { setLoaded as setLoadedHosts } from '../../redux/hosts/actions.js'

import { Loader, Dimmer } from 'semantic-ui-react'


class MainAccumulatorUpdater extends React.Component {

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

		this.triggerSetLoadedIPs.bind(this);
		this.triggerSetLoadedHosts.bind(this);
	}

	triggerSetLoadedIPs(value) {
		this.context.store.dispatch(setLoadedIPs({
			'status': 'success',
			'value': value,
			'project_uuid': String(this.props.project.project_uuid)
		}, String(this.props.project.project_uuid)));
	}

	triggerSetLoadedHosts(value) {
		this.context.store.dispatch(setLoadedHosts({
			'status': 'success',
			'value': value,
			'project_uuid': String(this.props.project.project_uuid)
		}, String(this.props.project.project_uuid)));
	}

	componentDidUpdate(prevProps) {
		var { hosts, filters } = this.props;

		if ((hosts.update_needed === true) || (!_.isEqual(filters, prevProps.filters))) {
			this.triggerSetLoadedIPs(false);
			this.triggerSetLoadedHosts(false);

			setTimeout(() => {
				this.renewHosts(this.pageNumberHost, filters, this.pageSize);
				this.renewIps(this.pageNumberIp, filters, this.pageSize);
			}, 100);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));
	}

	renewHosts(page=this.pageNumberHost, filters=this.props.filters, pageSize=this.pageSize) {
		var newFilters = filters;
		if (!filters['files']) {
			newFilters['files'] = ['%'];
		}

		this.hostsEmitter.requestRenewHosts(this.props.project.project_uuid, newFilters, page, this.pageSize);
	}

	renewIps(page=this.pageNumberIp, filters=this.props.filters, pageSize=this.pageSize) {
		var newFilters = filters;
		if (!filters['files']) {
			newFilters['files'] = ['%'];
		}

		this.ipsEmitter.requestRenewIPs(this.props.project.project_uuid, newFilters, page, this.pageSize);
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
		const { ips, hosts, applyFilters, project } = this.props;

		let scopes = this.getVisibleScopes();

		scopes.selected = {
			ips: ips.selected_ips,
			hosts: hosts.selected_hosts
		}

		let loaded = true;
		
		if      (this.pageType == 'ip')      loaded = ips.loaded
		else if (this.pageType == 'ip/host') loaded = ips.loaded && hosts.loaded
		else if (this.pageType == 'host')    loaded = hosts.loaded;

		return (
			<div>
			    <Dimmer active={!loaded}>
					<Loader />
			    </Dimmer>
				<TablesAccumulator
					applyFilters={applyFilters}
					ips={scopes.ips}
					hosts={scopes.hosts}
					selected={scopes.selected}
					project_name={project.project_name}
					changePage={this.changePage}
					pageSize={this.pageSize}
				/>
			</div>
		);
	}
}

MainAccumulatorUpdater.contextTypes = {
    store: React.PropTypes.object
}

export default MainAccumulatorUpdater;