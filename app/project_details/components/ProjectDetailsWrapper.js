import _ from 'lodash';
import { connect } from 'react-redux';

import ProjectDetails from './ProjectDetails.jsx';
import { updateComment as updateProjectComment } from '../../common/projects/actions';
import { updateComment as updateScopeComment } from '../../common/scopes/actions';


function mapStateToProps(state, ownProps){
	let project_name = ownProps.project_name;
	let filtered_projects = _.filter(state.projects, (x) => {
		return x.project_name == project_name
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
        scopes: {
        	'ips': _.filter(state.scopes.ips, (x) => {
	        	return x.project_uuid == project['project_uuid']
	        }),
        	'hosts': _.filter(state.scopes.hosts, (x) => {
	        	return x.project_uuid == project['project_uuid']
	        }),	        
        },
        tasks: _.filter(state.tasks.active, (x) => {
        	return x.project_uuid == project['project_uuid']
        }),
        scans: _.filter(state.scans, (x) => {
        	return x.project_uuid == project['project_uuid']
        })
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
		onProjectCommentChange: (comment, project_uuid) => {
			dispatch(updateProjectComment({
				'comment': comment, 
				'project_uuid': project_uuid
			}))
		},
		onScopeCommentChange: (comment, scope_id) => {
			dispatch(updateScopeComment({
				'comment': comment, 
				'_id': scope_id
			}))			
		}
	}
}


const ProjectsDetailsWrapper = connect(
	mapStateToProps,
	mapDispatchToProps
)(ProjectDetails)

export default ProjectsDetailsWrapper