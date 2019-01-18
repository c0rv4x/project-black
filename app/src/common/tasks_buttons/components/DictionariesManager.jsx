import React from 'react'

import { Heading } from 'grommet'

import DictionaryStats from './DictionaryStats.jsx'
import DictUploader from './DictUploader.jsx'
import DictsSocketioEventsEmitter from '../../../redux/dicts/DictsSocketioEventsEmitter.js'


class DictionariesManager extends React.Component {
    constructor(props) {
        super(props);

        this.renewDicts = this.renewDicts.bind(this);
        this.deleteDict = this.deleteDict.bind(this);
    }

    renewDicts() {
        this.dictsEmitter.getDicts(this.props.project_uuid);
    }

    componentDidMount() {
        // TODO: This can probably lead to race condition
        this.dictsEmitter = new DictsSocketioEventsEmitter();
        this.renewDicts();
    }

    deleteDict(dict_id) {

    }

    render() {
		return (
			<div>
                <Heading level="3">Dictionaries</Heading>
                <DictionaryStats
                    dicts={this.props.dicts}
                    deleteDict={this.deleteDict}
                />
                <DictUploader
                    project_uuid={this.props.project_uuid}
                    task_name={this.props.name}
                    renewDicts={this.renewDicts}
                />
            </div>
		)
	}

}

export default DictionariesManager;




