import React from 'react'

import { TextArea } from 'semantic-ui-react'

import EditableElement from '../editable/EditableElement.jsx'


class ScopeCommentPresentational extends React.Component {

	render() {
		return (
			<EditableElement
				value={this.props.scopeComment}
				onBlur={this.props.commentSubmitted}
				inputElement={TextArea}
				element={"div"}
			/>
		)
	}

}


export default ScopeCommentPresentational;
