import React from 'react'

import { TextArea, Form, Segment } from 'semantic-ui-react'

import EditableElement from '../editable/EditableElement.jsx'


class ProjectCommentPresentational extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Form>
		        <EditableElement value={this.props.projectComment}
		        				 onBlur={this.props.commentSubmitted}
		        				 inputElement={TextArea}
		        				 element={Segment} />
	        </Form>
		)
	}

}


export default ProjectCommentPresentational;
