import _ from 'lodash';
import { connect } from 'react-redux';

import TasksTab from './TasksTab.jsx';


function mapStateToProps(state, ownProps){
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

    const active_tasks = _.filter(state.tasks.active, (x) => {
        return x.project_uuid == project['project_uuid']
    });

    const finished_tasks = _.filter(state.tasks.finished, (x) => {
        return x.project_uuid == project['project_uuid']
    });

    return {
        project: project,
        // scopes: {
        //  'ips': _.filter(state.scopes.ips, (x) => {
        //      return x.project_uuid == project['project_uuid']
        //     }),
        //  'hosts': _.filter(state.scopes.hosts, (x) => {
        //      return x.project_uuid == project['project_uuid']
        //     }),          
        // },
        tasks: active_tasks.concat(finished_tasks)
        // scans: _.filter(state.scans, (x) => {
        //  return x.project_uuid == project['project_uuid']
        // })
    }
}


const TasksTabWrapper = connect(
    mapStateToProps
)(TasksTab)

export default TasksTabWrapper;
