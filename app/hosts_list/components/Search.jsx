import _ from 'lodash'
import React from 'react'
import Select from 'react-select'
import { Button } from 'react-bootstrap'


class Search extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			multiValue: [],
			options: [
				{ label: 'host: *.ya.ru' },
				{ label: 'ip: 8.8.8.8' },
				{ label: 'port: 80' },
				{ label: 'banner: apache' }
			]
		}

		this.handleOnChange = this.handleOnChange.bind(this);
		this.parseActiveOptions = this.parseActiveOptions.bind(this);
	}

	handleOnChange (value) {
		this.setState({ multiValue: value });

		setTimeout(this.parseActiveOptions, 200);
	}

	parseActiveOptions() {
		const { multiValue } = this.state;
		var resultObject = {};

		for (var eachValue of multiValue) {
			const unparsedOptions = eachValue.label;
			const splitted = unparsedOptions.split(":");

			const key = splitted[0].trim();
			const value = splitted[1].trim();

			if (_.has(resultObject, key)) {
				resultObject[key].push(value);
			}
			else {
				resultObject[key] = [value];
			}
		}

		var regexes = {};
		for (var eachParam of Object.keys(resultObject)) {
			console.log(eachParam);
			var replacedStar
			// regexes[eachParam] = "(" +  + ")";
		}

		console.log(regexes);
	}

	render () {
		const { multiValue, options } = this.state;
		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select.Creatable
					multi={true}
					options={options}
					onChange={this.handleOnChange}
					value={multiValue}
				/>
			</div>
		);
	}
}

export default Search;
