import _ from 'lodash'
import { connect } from 'react-redux'

import HostsListFilters from './HostsListFilters.jsx'


function mapStateToProps(state, ownProps) {
	let project_uuid = ownProps.project_uuid;
	let filtered_projects = _.filter(state.projects, (x) => {
		return x.project_uuid == project_uuid
	});

	let project = null;

	if (filtered_projects.length) {
		project = filtered_projects[0]
	} else {
		project = {
			"project_name": null,
			"project_uuid": null,
			"comment": ""
		}
	}

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

            if (state.files.stats.hasOwnProperty(host.host_id)) {
                host.files = state.files.stats[host.host_id];
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
    	project_uuid: project.project_uuid,
    	hosts: new_hosts,
        tasks: state.tasks.active
    }
}


const HostsListWrapper = connect(
	mapStateToProps
)(HostsListFilters)

export default HostsListWrapper
