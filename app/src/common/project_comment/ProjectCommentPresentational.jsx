import React from 'react'

import { Form, TextArea } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'

import EditableElement from '../editable/EditableElement.jsx'


class ProjectCommentPresentational extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Form>
				<EditableElement
					value={this.props.projectComment}
					onBlur={this.props.commentSubmitted}
					inputElement={TextArea}
					element={ReactMarkdown}
					placeholder="# Click to edit the comment" />
			</Form>
		)
	}

}


export default ProjectCommentPresentational;
