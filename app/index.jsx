import React from 'react'
import {render} from 'react-dom'
import { Provider, connect } from 'react-redux'
import { createStore } from 'redux'

import rdcs from './redux/reducers.js'
import Routing from './common/main_page/Routing.jsx'

import 'bootstrap/dist/css/bootstrap.css';

var mainStore = createStore(rdcs);

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className="container">
                <Provider store={mainStore}>
                    <Routing />
                </Provider>
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));

