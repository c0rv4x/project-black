import React from 'react'

import { TextInput } from 'grommet'
import ReactMarkdown from 'react-markdown'

import EditableElement from '../editable/EditableElement.jsx'


class ProjectCommentPresentational extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<EditableElement
					value={this.props.projectComment}
					onBlur={this.props.commentSubmitted}
					inputElement={TextInput}
					element={ReactMarkdown}
					placeholder="# Click to edit the comment" />
			</div>
		)
	}

}


export default ProjectCommentPresentational;
