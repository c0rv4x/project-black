import React from 'react'
import {render} from 'react-dom'

import Routing from './common/main_page/Routing.jsx'

import Perf from 'react-addons-perf';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className="container">
                <Routing />
            </div>
        );
    }
}

window.Perf = Perf;
render(<App/>, document.getElementById('app'));
