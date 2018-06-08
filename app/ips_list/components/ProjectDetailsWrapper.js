import _ from 'lodash'
import { connect } from 'react-redux'

import ProjectDetailsFilters from './ProjectDetailsFilters.jsx'
import { updateComment as updateProjectComment } from '../../redux/projects/actions'
import { updateComment as updateScopeComment } from '../../redux/scopes/actions'
import { updateFilters } from '../../redux/filters/actions'


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

    if (state.ips) {
        for (var ip of state.ips.data) {
            ip.tasks = {
                "active": [],
                "finished": []
            };

            for (var task_raw of state.tasks.active) {
                let task_splitted = task_raw.target.split(',');

                if (task_splitted.indexOf(ip.ip_address) !== -1) {
                    ip.tasks.active.push(task_raw);
                }
            }

            for (var task_raw of state.tasks.finished) {
                let task_splitted = task_raw.target.split(',');

                if (task_splitted.indexOf(ip.ip_address) !== -1) {
                    ip.tasks.finished.push(task_raw);
                }
            }            
        }
    }

    return {
        project: project,
        ips: state.ips,
        tasks: state.tasks.active,
        scans: state.scans
    }
}


const ProjectDetailsWrapper = connect(
    mapStateToProps
)(ProjectDetailsFilters)

export default ProjectDetailsWrapper
