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

    let new_hosts = JSON.parse(JSON.stringify(state.hosts));

    if (new_hosts) {
        for (var host of new_hosts.data) {
            host.tasks = {
                "active": [],
                "finished": []
            };
            for (var task_raw of state.tasks.active) {
                if (task_raw.task_type == 'dirsearch') {
                    let task_splitted = task_raw.target.split(':');

                    if (task_splitted.indexOf(host.hostname) !== -1) {
                        host.tasks.active.push(task_raw);
                    }
                }
            }

            for (var task_raw of state.tasks.finished) {
                if (task_raw.task_type == 'dirsearch') {
                    let task_splitted = task_raw.target.split(':');

                    if (task_splitted.indexOf(host.hostname) !== -1) {
                        host.tasks.finished.push(task_raw);
                    }
                }
            }   
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
