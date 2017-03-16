import _ from 'lodash';
import { connect } from 'react-redux';

import ProjectDetails from './ProjectDetails.jsx';


function mapStateToProps(state, ownProps){
	let project_name = ownProps.match.params.project_name;
	let filtered_projects = _.filter(state.projects, (x) => {
		return x.project_name == project_name
	});

	let project = null;
	if (filtered_projects) {
		project = filtered_projects[0]
	} else {
		project = {
			"project_name": null,
			"project_uuid": null,
			"comment": null
		}
	}

    return {
    	project: project,
        scopes: _.filter(state.scopes, (x) => {
        	return x.project_uuid == project['project_uuid']
        })
    }
}


const ProjectsDetailsWrapper = connect(
	mapStateToProps
)(ProjectDetails)

export default ProjectsDetailsWrapper