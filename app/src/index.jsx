import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import rdcs from './redux/reducers.js'
import Routing from './navigation/Routing.jsx'

import { Grommet, Box } from 'grommet';
import { grommet } from "grommet/themes";


import JavascriptTimeAgo from 'javascript-time-ago'
 
// The desired locales.
import en from 'javascript-time-ago/locale/en'
 
// Initialize the desired locales.
JavascriptTimeAgo.locale(en)


import './semantic/semantic.min.css';
import './styles/notification_styles.css';
import './styles/table_fix.css';
import 'react-select/dist/react-select.css';

var mainStore = createStore(rdcs);

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <Grommet plain theme={grommet} full={true}>
                <Box pad="medium" align="stretch">
                    <Provider store={mainStore}>
                        <Routing />
                    </Provider>
                </Box>
            </Grommet>
        );
    }
}

render(<App/>, document.getElementById('app'));

