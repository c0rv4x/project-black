import * as React from 'react';
import { Component } from 'react';
import { Button } from 'grommet'
import * as uuid from 'uuid';


export class FileButton extends Component {
    constructor(props) {
        super(props);

        this.id = uuid.v1();
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    render() {
        let props = {
            onClick: () => document.getElementById(this.id).click()
        }
        if (this.props.label) {
            props.label = this.props.label;
        }
        if (this.props.icon) {
            props.icon = this.props.icon;
        }

        return (
            <span>
                <Button
                    {...props}
                />
                <input
                    hidden
                    id={this.id}
                    multiple
                    type="file"
                    onChange={this.onChangeFile}
                />
            </span>
        );
    }

    onChangeFile() {
        const fileButton = document.getElementById(this.id);
        const file = fileButton ? fileButton.files[0] : null;

        let reader = new FileReader();
        reader.onloadend = () => {
            this.props.fileLoadedHandler(reader.result);
        }
        reader.readAsText(file);

        if (this.props.onSelect) {
            this.props.onSelect(file);
        }
    }
}

export default FileButton;