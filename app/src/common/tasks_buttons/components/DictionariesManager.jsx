import _ from 'lodash'
import React from 'react'
import {
    Button,
	Divider,
    Icon
} from 'semantic-ui-react'

import DictionaryInput from './DictionaryInput.jsx'


class DictionariesManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputFields: []
        };

        this.addNewField = this.addNewField.bind(this);
    }

    addNewField() {
        const { inputFields } = this.state;

        this.setState({
            inputFields: [
                ...inputFields,
                <DictionaryInput key={inputFields.length} name={inputFields.length} />
            ]
        });
    }

    render() {
		return (
			<div>
                {this.state.inputFields}

                <Button size="tiny" onClick={this.addNewField}><Icon name="plus" />Add new field</Button>
                <Divider hidden />
            </div>
		)
	}

}

export default DictionariesManager;




