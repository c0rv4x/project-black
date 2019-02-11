import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types';

import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import TablesAccumulator from './TablesAccumulator.jsx'
import Loading from '../../common/loading/Loading.jsx'

import { flushAndRequestIPs } from '../../redux/ips/actions.js'
import { flushAndRequestHosts } from '../../redux/hosts/actions.js'
import { requestFilesHost, requestFilesIP } from '../../redux/files/actions.js'


class MainAccumulatorUpdater extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			pageNumberUnmodified: 0
		}

		this.renewHosts = this.renewHosts.bind(this);
		this.renewIps = this.renewIps.bind(this);
		this.changePage = this.changePage.bind(this);
		this.getVisibleScopes = this.getVisibleScopes.bind(this);

		this.pageSize = 4;
		this.pageNumberIp = 0;
		this.pageNumberHost = 0;
		this.pageType = 'ip';

		this.getFilesIps = this.getFilesIps.bind(this);
		this.getFilesHosts = this.getFilesHosts.bind(this);
	}

	componentDidMount() {
		this.hostsEmitter = new HostsSocketioEventsEmitter();
	}

	componentDidUpdate(prevProps) {
		var { filters } = this.props;

		if (!_.isEqual(filters, prevProps.filters)) {
			this.setState({
				pageNumberUnmodified: 0
			});

			setTimeout(() => {
				this.pageNumberHost = 0;
				this.pageNumberIp = 0;
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

		this.context.store.dispatch(flushAndRequestHosts(this.props.project_uuid, newFilters, page, this.pageSize));
	}

	renewIps(page=this.pageNumberIp, filters=this.props.filters, pageSize=this.pageSize) {
		var newFilters = filters;
		if (!filters['files']) {
			newFilters['files'] = ['%'];
		}

		this.context.store.dispatch(flushAndRequestIPs(this.props.project_uuid, newFilters, page, this.pageSize));
	}

	getFilesHosts(host, port_number, limit, offset, filters) {
		this.context.store.dispatch(requestFilesHost(host, port_number, limit, offset, filters));
	}

	getFilesIps(ip, port_number, limit, offset, filters) {
		this.context.store.dispatch(requestFilesIP(ip, port_number, limit, offset, filters));
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
		this.setState({
			pageNumberUnmodified: pageNumberUnmodified - 1
		});

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
				<Loading
					componentLoading={!this.props.hosts.loaded}
				>
					<TablesAccumulator
						applyFilters={applyFilters}
						files={files}
						ips={scopes.ips}
						hosts={scopes.hosts}
						selected={scopes.selected}
						project_name={project.project_name}
						project_uuid={project_uuid}
						changePage={(x) => this.changePage(x)}
						pageNumberUnmodified={this.state.pageNumberUnmodified}
						pageSize={this.pageSize}
						getFilesHosts={(host, port_number, limit, offset) => {
							this.getFilesHosts(host, port_number, limit, offset, filters['files']);
						}}
						getFilesIps={(ip, port_number, limit, offset) => {
							this.getFilesIps(ip, port_number, limit, offset, filters['files']);
						}}
					/>
				</Loading>
			</div>
		);
	}
}

MainAccumulatorUpdater.contextTypes = {
    store: PropTypes.object
}

export default MainAccumulatorUpdater;