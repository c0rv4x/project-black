import _ from 'lodash'
import React from 'react'
import Creatable from 'react-select/lib/Creatable'
import { components } from 'react-select';

import { Box, Text } from 'grommet'
import { Close } from 'grommet-icons'


const SelectContainer = ({ children, ...props }) => {
	return (
	  <select>
		<components.SelectContainer {...props}>
		  {children}
		</components.SelectContainer>
	  </select>
	);
  };

const MultiValueContainer = (props) => {
	return (
	  <Box
		background="brand"
		direction="row"
		round="xsmall"
	  >
		<components.MultiValueContainer {...props} />
	  </Box>
	);
};

const MultiValueLabel = (props) => {
	return (
	  <Box
		background="brand"
		direction="row"
	  >
		<components.MultiValueLabel {...props}>
			<Text color="light-2">{props.children}</Text>
		</components.MultiValueLabel>
	  </Box>
	);
};


const MultiValueRemove = (props) => {
	return (
	  <Box
		background="brand"
		direction="row"
	  >
		<components.MultiValueRemove {...props}>
			<Close color="light-2" size="small" />
		</components.MultiValueRemove>
	  </Box>
	);
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

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
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
				<Creatable
					components={{ MultiValueContainer, MultiValueLabel, MultiValueRemove }}
					isMulti={true}
					options={options}
					onChange={this.handleOnChange}
					value={multiValue}
				/>
			</div>
		);
	}
}

export default Search;
