import React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'


import ProjectList from './projects_list/ProjectList.jsx';
import ProjectDetails from './project_details/ProjectDetails.jsx';


class App extends React.Component {
    render () {
        return (
            <div>
                <Router>
                    <div>
                        <h1>Project Black</h1>
                        <Link to="/">Home</Link>

                        <div>
                            <Route exact path="/" component={ProjectList} />
                            <Route exact path="/project/:projectName" component={ProjectDetails} />
                        </div>
                    </div>
                </Router>            
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));
