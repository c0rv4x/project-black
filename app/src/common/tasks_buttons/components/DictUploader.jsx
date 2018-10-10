import React from 'react'
import {
    Form
} from 'semantic-ui-react'


class DictUploader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "name": "",
            "dictionary": ""
        };

        this.upload = this.upload.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    upload() {
        console.log(this.state);
    }

    onChangeFile() {
        const fileButton = document.getElementById("dict_upload_id");
        const file = fileButton ? fileButton.files[0] : null;

        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                'dictionary': reader.result
            });
        }
        reader.readAsText(file);
    }

    render() {
		return (
			<div>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Input
                            fluid
                            error={this.state.name.length == 0}
                            label='Name'
                            placeholder=''
                            value={this.state.name}
                            onChange={(e) => {
                                this.setState({
                                    "name": e.target.value
                                });
                            }}
                        />
                        <Form.Input
                            fluid
                            label='Dictionary'
                            type='file'
                            id='dict_upload_id'
                            onChange={this.onChangeFile}
                        />
                        <Form.Button fluid label='Upload' onClick={this.upload}>Upload</Form.Button>
                    </Form.Group>
                </Form>               
            </div>
		)
	}

}

export default DictUploader;




