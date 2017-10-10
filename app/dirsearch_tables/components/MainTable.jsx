import _ from 'lodash'
import React from 'react'

import Filtering from './Filtering.jsx'
import TablesAccumulator from './TablesAccumulator.jsx'


class MainTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			filters: []
		}

		this.filters = {
			"only_200": {
				"name" : "Only 200",
				"filter_function": ((x) => { return Math.floor(x.status_code / 100) === 2 } ),
				"active": false
			},
			"only_400": {
				"name" : "Only 400",
				"filter_function": ((x) => { return x.status_code === 400 } ),
				"active": false
			},
			"only_401": {
				"name" : "Only 401",
				"filter_function": ((x) => { return x.status_code === 401 } ),
				"active": false
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.files) {
			this.setState({
				files: nextProps.files
			});
		}
	}

	triggerFilter(filterName) {
		if (this.state.filters.indexOf(filterName) !== -1) {
			this.filters[filterName].active = !this.filters[filterName].active;

			var index = this.state.filters.indexOf(filterName);
			var new_filters = JSON.parse(JSON.stringify(this.state.filters));
			new_filters.splice(index, 1);

			this.setState({
				filters: new_filters
			});
		}
		else {
			this.filters[filterName].active = !this.filters[filterName].active;

			this.setState({
				filters: [...this.state.filters, filterName]
			});
		}
	}

	render() {
		var { files } = this.props;
		var files_filtered;

		if (this.state.filters.length) {
			files_filtered = {};

			var filter_functions = this.state.filters.map((x) => {
				return this.filters[x].filter_function;
			});

			_.forOwn(files , (value, key) => {
				files_filtered[key] = value.filter((x) => {
					for (var each_filter_function of filter_functions) {
						if (each_filter_function(x)) {
							return true;
						}
					}

					return false;
				});
			});
		}
		else {
			files_filtered = files;
		}

		return (
			<div>
				This is the main table
				<Filtering filters={this.filters}
						   triggerFilter={this.triggerFilter.bind(this)} />
				<br />

				<TablesAccumulator ips={this.props.ips}
								   hosts={this.props.hosts}
								   ports={this.props.ports}
								   files={files_filtered} />
			</div>
		)
	}
}

export default MainTable;