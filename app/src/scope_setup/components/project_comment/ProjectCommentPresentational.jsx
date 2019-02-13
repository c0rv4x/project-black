import React from 'react'

import { Box, Markdown, TextArea } from 'grommet'

import EditableElement from '../../../common/editable/EditableElement.jsx'


class ProjectCommentPresentational extends React.Component {
	render() {
		return (
			<Box>
				<EditableElement
					value={this.props.projectComment}
					onBlur={this.props.commentSubmitted}
					inputElement={TextArea}
					element={Markdown}
					staticRaw={true}
					placeholder="## Click to edit the comment" />
			</Box>
		)
	}

}


export default ProjectCommentPresentational;
