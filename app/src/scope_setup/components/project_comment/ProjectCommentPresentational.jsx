import React from 'react'

import { Box, Heading, Markdown, TextArea } from 'grommet'

import EditableElement from '../../../common/editable/EditableElement.jsx'


class ProjectCommentPresentational extends React.Component {
	render() {
		return (
			<Box
				border={{
					color: "light-4",
					size: "small"
				}}
				round="xsmall"
				pad="small"
				margin="small"
			>
				<Heading
					level="5"
					margin={{
						top: "none",
						bottom: "small"
					}}
				>
					Project comment
				</Heading>
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
