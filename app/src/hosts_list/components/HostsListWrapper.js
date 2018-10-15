import _ from 'lodash'
import { connect } from 'react-redux'

import HostsListFilters from './HostsListFilters.jsx'


function mapStateToProps(state, ownProps) {
	let project_uuid = ownProps.project_uuid;

    let creds_dict = {};
    for (let cred of _.get(state.creds, "current_values", [])) {
        if (creds_dict.hasOwnProperty(cred.target)) {
            creds_dict[cred.target]["values"].push(cred);
        }
        else {
            creds_dict[cred.target] = {
                "values": [cred]
            };
        }
    }

    let new_hosts = JSON.parse(JSON.stringify(state.hosts));

    if (new_hosts) {
        for (var host of new_hosts.data) {
            host.target = host.hostname;
            host.creds = {
                "values": []
            };

            if (creds_dict.hasOwnProperty(host.hostname)) {
                host.creds = creds_dict[host.hostname];
            }

            if (state.files.stats.host.hasOwnProperty(host.host_id)) {
                host.files = state.files.stats.host[host.host_id];
            }
            else {
                host.files = []
            }


            host.tasks = {
                "active": [],
                "finished": []
            };
            for (var task_raw of state.tasks.active) {
                if ((task_raw.task_type == 'dirsearch') || (task_raw.task_type == 'patator')) {
                    let task_splitted = task_raw.target.split(':');

                    if (task_splitted.indexOf(host.hostname) !== -1) {
                        host.tasks.active.push(task_raw);
                    }
                }
            }

            for (var task_raw of state.tasks.finished) {
                if ((task_raw.task_type == 'dirsearch') || (task_raw.task_type == 'patator')) {
                    let task_splitted = task_raw.target.split(':');

                    if (task_splitted.indexOf(host.hostname) !== -1) {
                        host.tasks.finished.push(task_raw);
                    }
                }
            }

            host.ip_addresses.sort((a, b) => {
                if (a.ip_id < b.ip_id) return 1;
                if (a.ip_id > b.ip_id) return 1;
                return 0;
            });
        }
    }

    return {
    	project_uuid: project_uuid,
    	hosts: new_hosts,
        dicts: state.dicts,
        tasks: state.tasks.active
    }
}


const HostsListWrapper = connect(
	mapStateToProps
)(HostsListFilters)

export default HostsListWrapper
