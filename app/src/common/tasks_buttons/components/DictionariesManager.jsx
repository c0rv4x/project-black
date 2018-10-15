import React from 'react'
import {
    Divider,
    Header
} from 'semantic-ui-react'

import DictionaryStats from './DictionaryStats.jsx'
import DictUploader from './DictUploader.jsx'
import DictsSocketioEventsEmitter from '../../../redux/dicts/DictsSocketioEventsEmitter.js'


class DictionariesManager extends React.Component {
    constructor(props) {
        super(props);

        this.dictsEmitter = new DictsSocketioEventsEmitter();

        this.renewDicts = this.renewDicts.bind(this);
        this.deleteDict = this.deleteDict.bind(this);
    }

    renewDicts() {
        this.dictsEmitter.getDicts(this.props.project_uuid);
    }

    componentDidMount() {
        this.renewDicts();
    }

    deleteDict(dict_id) {

    }

    render() {
		return (
			<div>
                <Header as="h3">Dictionaries</Header>
                <DictionaryStats
                    dicts={this.props.dicts}
                    deleteDict={this.deleteDict}
                />
                <DictUploader
                    project_uuid={this.props.project_uuid}
                    task_name={this.props.name}
                    renewDicts={this.renewDicts}
                />
                <Divider hidden />
            </div>
		)
	}

}

export default DictionariesManager;




