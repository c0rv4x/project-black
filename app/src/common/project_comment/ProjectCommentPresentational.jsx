import React from 'react'

import { Markdown, TextInput } from 'grommet'

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
					element={Markdown}
					placeholder="# Click to edit the comment" />
			</div>
		)
	}

}


export default ProjectCommentPresentational;
