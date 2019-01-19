import React from 'react'

import { Box, Button, Text, TextArea } from 'grommet'
import { Upload } from 'grommet-icons'
import ScopeUpload from '../../scope_adder/components/ScopeUpload.jsx'

import autosize from 'autosize'

class DictUploader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "name": "",
            "dictionary": "",
            "upload_in_progress": false
        };

        this.upload = this.upload.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    upload() {
        this.setState({
            // "upload_in_progress": true
        });

        let requester = new XMLHttpRequest();
        requester.onreadystatechange = function () {
            if(requester.readyState == XMLHttpRequest.DONE && requester.status == 200) {
                this.setState({
                    "upload_in_progress": false
                });
                this.props.renewDicts();
            }            
        }.bind(this);

        requester.open("POST", "/upload_dict");
        requester.setRequestHeader("Content-Type", "application/json");
        requester.send(JSON.stringify({
            "project_uuid": this.props.project_uuid,
            "dict_type": this.props.task_name,
            "name": this.state.name,
            "content": btoa(this.state.dictionary)
        }));
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

	componentDidUpdate() {
		if (this.input) {
			autosize(this.input);
		}
	}

    render() {
		return (
			<div>
                <Box
                    direction="row"
                    align="stretch"
                    alignContent="stretch"
                    margin={{ right: 'xsmall', bottom: 'xsmall' }}
                >
                    <Box margin={{ right: 'xsmall' }}>
                        <TextArea
                            ref={(input) => {
                                this.input = input;
                            }}
                            rows={1}
                            value={this.state.name}
                            placeholder="Name"
                            onChange={(e) => {
                                this.setState({
                                    "name": e.target.value
                                });
                            }}
                            style={{ resize: 'none' }}
                        />
                    </Box>
                    <Box
                        alignSelf="stretch"
                        justify="center"
                    >
                        <ScopeUpload
                            fileLoadedHandler={(text) => this.setState({ dictionary: text })}
                            icon={<Upload />}
                        />
                    </Box>
                    <Box alignSelf="center" justify="end">
                        <Button label="Upload" onClick={this.upload} />
                    </Box>
                </Box>
                {/* <Form>
                    <Form.Group widths='equal'>
                        <Form.Input
                            fluid
                            label='Dictionary'
                            type='file'
                            id='dict_upload_id'
                            onChange={this.onChangeFile}
                        />
                        <Form.Button
                            fluid
                            label='Upload'
                            loading={this.state.upload_in_progress}
                            onClick={this.upload}
                        >
                            Upload
                        </Form.Button>
                    </Form.Group>
                </Form>                */}
            </div>
		)
	}

}

export default DictUploader;




