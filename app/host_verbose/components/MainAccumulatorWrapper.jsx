import { connect } from 'react-redux';

import MainAccumulator from './MainAccumulator.jsx';


function mapStateToProps(state, ownProps){
    // Extract project
    let project_uuid = ownProps.match.params.project_uuid;
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

    // Extract hostname
    let hostname = ownProps.match.params.hostname;
    let filtered_hosts = _.filter(state.hosts.data, (x) => {
        return x.hostname == hostname;
    });

    let host = null;

    if (filtered_hosts.length) {
        host = filtered_hosts[0];
    } else {
        host = {
            "hostname": null,
            "host_id": null,
            "comment": "",
            "ip_addresses": []
        }
    }

    return {
        project_uuid: project.project_uuid,
        host: host,
        tasks: state.tasks.active,
        files: state.files[host.hostname],
        ports: _.get(_.get(host.ip_addresses, 0, {}), 'scans', [])
    }
}


const MainAccumulatorWrapper = connect(
    mapStateToProps
)(MainAccumulator)

export default MainAccumulatorWrapper
