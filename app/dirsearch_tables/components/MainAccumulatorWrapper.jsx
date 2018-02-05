import { connect } from 'react-redux';

import MainAccumulator from './MainAccumulator.jsx';


function mapStateToProps(state, ownProps) {
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

    return {
    	project: project,
    	ips: state.ips,
    	hosts: state.hosts,
    	files: state.files
    }
}


const MainAccumulatorWrapper = connect(
	mapStateToProps
)(MainAccumulator)

export default MainAccumulatorWrapper
