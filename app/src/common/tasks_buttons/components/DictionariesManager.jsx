import React from 'react'
import {
    Divider,
    Header
} from 'semantic-ui-react'

import DictionaryStats from './DictionaryStats.jsx'
import DictUploader from './DictUploader.jsx'


class DictionariesManager extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.dicts);
		return (
			<div>
                <Header as="h3">Dictionaries</Header>
                <DictionaryStats dicts={this.props.dicts} />
                <DictUploader />
                <Divider hidden />
            </div>
		)
	}

}

export default DictionariesManager;




