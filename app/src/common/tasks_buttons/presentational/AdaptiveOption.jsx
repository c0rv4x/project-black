import _ from 'lodash'
import React from 'react'

import {
	CheckBox,
	FormField,
	TextArea
} from 'grommet'

import getLineHeight from 'line-height'


class AdaptiveOption extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			rows: 1
		}

		this.objectKey = null;

		this.changeInput = this.changeInput.bind(this);
	}

	changeInput(e) {
		// Solution for auto rows from https://jsfiddle.net/kx4vt4uj/1/
		const oldRows = e.target.rows;
		e.target.rows = 1;
		const newRows = ~~(e.target.scrollHeight / getLineHeight(document.getElementById("text-area-" + this.objectKey)));

		if (newRows === oldRows) {
			e.target.rows = newRows;
		}

		this.setState({
			rows: newRows
		});
		this.props.onInputChange(this.props.objectKey, e.target.value);
	}

	triggerBool(newValue) {
		this.props.onInputChange(this.props.objectKey, newValue.target.checked);
	}

	componentDidMount() {
		let target = document.getElementById("text-area-" + this.objectKey);
		
		if (target) {
			const oldRows = target.rows;
			target.rows = 1;
			const newRows = ~~(target.scrollHeight / getLineHeight(target));

			console.log(oldRows, newRows, target.scrollHeight, getLineHeight(target), ~~(target.scrollHeight / getLineHeight(target)));

			if (newRows === oldRows) {
				target.rows = newRows;
			}

			this.setState({
				rows: newRows
			});
		}
		
	}

	render() {
		const { value, objectKey } = this.props;

		this.objectKey = objectKey;

		if (value.type === 'checkbox') {
			return (
				<CheckBox checked={value.value}
							onChange={this.triggerBool.bind(this)}
							label={objectKey && _.capitalize(objectKey)} />
			)
		}
		else {
			console.log(1111, this.state.rows, objectKey);
			return (
				<FormField label={_.capitalize(objectKey)} htmlFor={"text-area" + objectKey} >
					<TextArea
						style={{ resize: 'none' }}
						id={"text-area-" + objectKey}
						type={value.type}
						placeholder={objectKey}
						value={value.value}
						onChange={this.changeInput}
						rows={this.state.rows}
					/>
				</FormField>
			)
		}
	}
}

export default AdaptiveOption;