import _ from 'lodash'
import { connect } from 'react-redux'

import ProjectDetails from './ProjectDetails.jsx'
import { updateComment as updateProjectComment } from '../../redux/projects/actions'
import { updateComment as updateScopeComment } from '../../redux/scopes/actions'
import { updateFilters } from '../../redux/filters/actions'


function formIPs(ips_list) {
    var ips = ips_list.sort((a, b) => {
        if (a.ip_address < b.ip_address) return -1
        if (a.ip_address > b.ip_address) return 1
        return 0
    });

    return ips;
}

function formHosts(hosts_list) {
    var hosts = hosts_list.sort((a, b) => {
        if (a.hostname < b.hostname) return -1
        if (a.hostname > b.hostname) return 1
        return 0
    });

    return hosts
}

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

    let scans = state.scans;

    return {
        project: project,
        scopes: {
            'ips': formIPs(state.scopes.ips),
            'hosts': formHosts(state.scopes.hosts)
        },
        tasks: state.tasks.active,
        scans: scans,
        filters: state.filters.ips
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        onFilterChangeIPs: (ipsFilters) => {
            dispatch(updateFilters({
                'ips': ipsFilters
            }))             
        }
    }
}

const ProjectDetailsWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectDetails)

export default ProjectDetailsWrapper
