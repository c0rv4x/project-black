import React from 'react'

import {
    Box,
    Button,
    TableRow,
    TableCell,
    Text,
    TextArea
} from 'grommet'

import { Upload } from 'grommet-icons'
import ScopeUpload from '../../../scope_setup/component/scope_adder/components/ScopeUpload.jsx'

import autosize from 'autosize'

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

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
            "content": b64EncodeUnicode(this.state.dictionary)
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
            <TableRow>
                <TableCell>
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
                </TableCell>
                <TableCell>
                    <ScopeUpload
                        fileLoadedHandler={(text) => this.setState({ dictionary: text })}
                        icon={<Upload />}
                    />
                </TableCell>
                <TableCell>
                    <Button label="Upload" onClick={this.upload} />
                </TableCell>
            </TableRow>
		)
	}

}

export default DictUploader;




