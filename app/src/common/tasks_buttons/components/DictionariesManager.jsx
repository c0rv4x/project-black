import React from 'react'
import PropTypes from 'prop-types'

import DictionaryStats from './DictionaryStats.jsx'
import { requestDicts } from '../../../redux/dicts/actions.js'

import { Heading } from 'grommet'


class DictionariesManager extends React.Component {
    constructor(props) {
        super(props);

        this.renewDicts = this.renewDicts.bind(this);
        this.deleteDict = this.deleteDict.bind(this);
    }

    renewDicts() {
        this.context.store.dispatch(requestDicts());
    }

    componentDidMount() {
        this.renewDicts();
    }

    deleteDict(dict_id) {

    }

    render() {
		return (
			<div>
                <Heading level="3">Dictionaries</Heading>
                <DictionaryStats
                    project_uuid={this.props.project_uuid}
                    name={this.props.name}
                    dicts={this.props.dicts}
                    renewDicts={this.renewDicts}
                    deleteDict={this.deleteDict}
                />
            </div>
		)
	}

}

DictionariesManager.contextTypes = {
    store: PropTypes.object
}

export default DictionariesManager;




