import React from 'react'

import { Button } from 'react-bootstrap'

import FilteringButtons from '../presentational/FilteringButtons.jsx'


class Filtering extends React.Component {
	constructor(props) {
		super(props);

		this.options = [
			{
				"name": "Only 200",
				"id": "only_200",
				"handler": ((x) => {
					console.log("only 200 pressed");
				})
			}
		];
	}

	render() {
		var buttons = this.options.map((option) => {
			return <Button key={option.id} onClick={option.handler}>{option.name}</Button>
		});

		return (
			<FilteringButtons options={
				[
					{
						"name": "Only 200",
						"id": "only_200",
						"handler": ((x) => {
							console.log("only 200 pressed");
						})
					}
				]
			} />
		)
	}
}

export default Filtering;