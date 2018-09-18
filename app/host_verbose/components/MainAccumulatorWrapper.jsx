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

    // let ports_unsorted = _.get(_.get(host.ip_addresses, 0, {}), 'scans', []);
    let ports_unsorted = [];

    for (var ip_address of host.ip_addresses) {
        let scans = _.get(ip_address, 'scans', []);
        for (var scan of scans) {            
            let found = false;

            for (var port of ports_unsorted) {
                if (scan.port_number == port.port_number) {
                    found = true;
                    break;
                }
            }

            if (found) {
                continue;
            }
            else {
                ports_unsorted.push(scan);
            }
        }
    }

    let ports = ports_unsorted.sort((x, y) => {
        return x.port_number > y.port_number;
    });

    return {
        project_uuid: project.project_uuid,
        host: host,
        tasks: state.tasks.active,
        ports: ports,
        update_needed: state.hosts.update_needed
    }
}


const MainAccumulatorWrapper = connect(
    mapStateToProps
)(MainAccumulator)

export default MainAccumulatorWrapper
