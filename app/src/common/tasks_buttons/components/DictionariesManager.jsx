import _ from 'lodash'
import React from 'react'
import {
    Divider,
    Header
} from 'semantic-ui-react'

import DictionaryStats from './DictionaryStats.jsx'


class DictionariesManager extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
		return (
			<div>
                <Header as="h3">Dictionaries</Header>
                <DictionaryStats />
                <Divider hidden />
            </div>
		)
	}

}

export default DictionariesManager;




