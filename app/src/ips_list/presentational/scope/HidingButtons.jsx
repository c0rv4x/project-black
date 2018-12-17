import _ from 'lodash'
import React from 'react'

import {
    Button,
    Dropdown,
    Icon,
	Label
} from 'semantic-ui-react'


class HidingButtons extends React.Component {
	constructor(props) {
        super(props);
        
        this.state = {
            "opened": false
        }

        this.renderMinimalElement = this.renderMinimalElement.bind(this);
        this.renderAllElement = this.renderAllElement.bind(this);
    }
    
    renderMinimalElement() {
        return (
            <div>
                <Button
                    basic icon size="small"
                >
                    <Icon name='ellipsis horizontal' />
                </Button>
            </div>
        )
    }

    renderAllElement() {
        const { project_uuid, type, target } = this.props;
        const verbose_host_link = '/project/' + project_uuid + '/' + type + '/' + target;

        return (
                <Dropdown icon="ellipsis horizontal">
                    <Dropdown.Menu>
                        <Dropdown.Item
                            icon="google"
                            content="Google Dork"
                            onClick={() => window.open("https://google.com/search?q=site:" + target, Math.random().toString(36).substring(7))}
                        />
                        <Dropdown.Item
                            icon="cogs"
                            content="Details"
                            onClick={() => window.open(verbose_host_link, Math.random().toString(36).substring(7), 'width=850,height=700')}
                        />
                    </Dropdown.Menu>
                </Dropdown>

        )
    }

	render() {
        console.log(this.state.opened);
		return (
            this.renderAllElement()
		)	
	}
}

export default HidingButtons;