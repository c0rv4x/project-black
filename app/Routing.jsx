import React from 'react'
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'

import ProjectsMainComponentWrapper from './projects_list/components/ProjectsMainComponentWrapper.js'
import ProjectsDetailsWrapper from './project_details/components/ProjectDetailsWrapper.js'
import ScopeSetupWrapper from './scope_setup/components/ScopeSetupWrapper.js'

import NavigationTabs from './common/NavigationTabs.jsx'
import HostPage from './host_verbose/components/MainAccumulatorWrapper.jsx'

class Routing extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/"
                           component={ProjectsMainComponentWrapper} />
                    <Route exact path="/project/:project_name" 
                           component={NavigationTabs} />
                    <Route exact path="/project/:project_name/host/:hostname" 
                           component={HostPage} />                           
                </div>
            </Router> 
        )
    }
}

export default Routing;