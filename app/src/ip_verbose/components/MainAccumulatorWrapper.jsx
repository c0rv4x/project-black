import { connect } from 'react-redux';

import IPVerboseUpdater from './IPVerboseUpdater.jsx';


function mapStateToProps(state, ownProps){
    // Extract project
    let project_uuid = ownProps.match.params.project_uuid;

    let ip_param = ownProps.match.params.ip_address;
    let ip = null;

    let ips = _.filter(state.ips.data, (x) => {
        return x.ip_address == ip_param
    });

    if (ips.length > 0) {
        ip = ips[0];
    }

    ip = ip || { "ip_address": null, "comment": "", "ip_id": null };
    ip.loaded = state.ips.loaded;

    let ports_unsorted = _.get(ip, 'scans', []);
    let ports = ports_unsorted.sort((x, y) => {
        return x.port_number > y.port_number;
    });

    return {
        project_uuid: project_uuid,
        ip: ip,
        files: _.get(state.files.files.ip, ip.ip_id, {}),
        stats: _.get(state.files.stats.ip, ip.ip_id, {}),        
        tasks: state.tasks.active,
        ports: ports
    }
}


const MainAccumulatorWrapper = connect(
    mapStateToProps
)(IPVerboseUpdater)

export default MainAccumulatorWrapper
