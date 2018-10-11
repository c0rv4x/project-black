import _ from 'lodash'
import React from 'react'
import {
    Button,
	Divider,
    Icon
} from 'semantic-ui-react'

import DictionariesManager from './DictionariesManager.jsx'


class Dictionaries extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "dictsHidden": true
        };
    }

    render() {
		return (
			<div>
                {!this.state.dictsHidden &&
                    <DictionariesManager
                        project_uuid={this.props.project_uuid}
                        dicts={this.props.dicts}
                        name={this.props.name}
                    />
                }
                <Button
                    onClick={() => this.setState({"dictsHidden": !this.state.dictsHidden})}
                >
                    <Icon name="book" />{this.state.dictsHidden && "Show"}{!this.state.dictsHidden && "Hide"} Dictionaries
                </Button>
                <Divider hidden />
            </div>
		)
	}

}

export default Dictionaries;




