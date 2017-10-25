import React from 'react'

import { TextArea, Form, Segment } from 'semantic-ui-react'

import EditableElement from '../editable/EditableElement.jsx'


class ScopeCommentPresentational extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Form>
		        <EditableElement value={this.props.scopeComment}
		        				 onBlur={this.props.commentSubmitted}
		        				 inputElement={TextArea}
		        				 element={Segment} />
	        </Form>
		)
	}

}


export default ScopeCommentPresentational;
