import * as React from 'react';
import { Component } from 'react';
import { Button, ButtonProps, Label } from 'semantic-ui-react';
import * as uuid from 'uuid';


export class FileButton extends Component {
    constructor(props) {
        super(props);

        this.id = uuid.v1();
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    render() {
        return (
            <span>
                <Button
                    as="label"
                    htmlFor={this.id}
                >
                    {this.props.children}
                </Button>
                <input
                    hidden
                    id={this.id}
                    multiple
                    type="file"
                    onChange={this.onChangeFile} />
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