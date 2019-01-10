import React from 'react'

import EditableElement from '../editable/EditableElement.jsx'


class ScopeCommentPresentational extends React.Component {

	render() {
		return (
			<EditableElement
				value={this.props.scopeComment}
				onBlur={this.props.commentSubmitted}
				inputElement={"textarea"}
				element={"div"}
			/>
		)
	}

}


export default ScopeCommentPresentational;
