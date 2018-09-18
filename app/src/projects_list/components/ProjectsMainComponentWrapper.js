import { connect } from 'react-redux'

import ProjectsMainComponent from './ProjectsMainComponent.jsx'


function mapStateToProps(state){
    return {
        projects: state.projects
    }
}


const ProjectsMainComponentWrapper = connect(
	mapStateToProps
)(ProjectsMainComponent)

export default ProjectsMainComponentWrapper
