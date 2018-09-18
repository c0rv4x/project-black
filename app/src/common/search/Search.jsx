import _ from 'lodash'
import React from 'react'
import Select from 'react-select'
import { Button } from 'semantic-ui-react'


function splice(oldStr, start, delCount, newSubStr) {
	const intStart = parseInt(start);
    return oldStr.slice(0, intStart) + newSubStr + oldStr.slice(intStart + Math.abs(delCount));
};

class Search extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			multiValue: [],
			options: [
				{ value: 'host: %.ru', label: 'host: %.ru'},
				{ value: 'ip: 8.8.8.8', label: 'ip: 8.8.8.8' },
				{ value: 'port: 80', label: 'port: 80' },
				{ value: 'port: %', label: 'port: %' },
				{ value: 'files: 200', label: 'files: 200' },
				{ value: 'banner: apache', label: 'banner: apache' }
			]
		}

		this.handleOnChange = this.handleOnChange.bind(this);
		this.parseActiveOptions = this.parseActiveOptions.bind(this);
	}

	handleOnChange(value) {
		this.setState({ multiValue: value });

		setTimeout(this.parseActiveOptions, 100);
	}

	parseActiveOptions() {
		const { multiValue } = this.state;
		var resultObject = {};

		for (var eachValue of multiValue) {
			const unparsedOptions = eachValue.value;
			const splitted = unparsedOptions.split(":");

			const key = splitted[0].trim();
			const value = splitted.slice(1).join(':').trim();

			if (_.has(resultObject, key)) {
				resultObject[key].push(value);
			}
			else {
				resultObject[key] = [value];
			}
		}

		this.props.applyFilters(resultObject);
	}

	render() {
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
