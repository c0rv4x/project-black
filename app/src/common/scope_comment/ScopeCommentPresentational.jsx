import React from 'react'

import EditableElement from '../editable/EditableElement.jsx'

import { TextArea } from 'grommet'


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
