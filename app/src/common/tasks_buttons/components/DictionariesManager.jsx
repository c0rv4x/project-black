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
		return (
			<div>
                <Header as="h3">Dictionaries</Header>
                <DictionaryStats dicts={this.props.dicts} />
                <DictUploader
                    project_uuid={this.props.project_uuid}
                    task_name={this.props.name}    
                />
                <Divider hidden />
            </div>
		)
	}

}

export default DictionariesManager;




