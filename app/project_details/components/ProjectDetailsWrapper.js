import { connect } from 'react-redux';

import ProjectDetails from './ProjectDetails.jsx';


function mapStateToProps(state){
    return {
        scopes: state.scopes
    }
}


const ProjectsDetailsWrapper = connect(
	mapStateToProps
)(ProjectsMainComponent)

export default ProjectsDetailsWrapper