import _ from 'lodash'
import { connect } from 'react-redux';

import HostVerboseUpdater from './HostVerboseUpdater.jsx';


function mapStateToProps(state, ownProps){
    // Extract project
    let project_uuid = ownProps.match.params.project_uuid;

    // Extract hostname
    let hostname = ownProps.match.params.hostname;
    let filtered_hosts = _.filter(state.hosts.data, (x) => {
        return x.hostname == hostname;
    });

    let host = null;

    if (filtered_hosts.length) {
        host = filtered_hosts[0];
        host.loaded = state.hosts.loaded;
    } else {
        host = {
            "hostname": null,
            "host_id": null,
            "comment": "",
            "ip_addresses": []
        }
    }

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
    console.log(state.files);
    return {
        project_uuid: project_uuid,
        host: host,
        files: _.get(state.files.files.host, host.host_id, {}),
        stats: _.get(state.files.stats.host, host.host_id, {}),
        tasks: state.tasks.active,
        ports: ports,
        update_needed: state.hosts.update_needed
    }
}


const HostVerboseWrapper = connect(
    mapStateToProps
)(HostVerboseUpdater)

export default HostVerboseWrapper
