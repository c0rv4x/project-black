import _ from 'lodash'
import React from 'react'

import { Box, MaskedInput, Keyboard } from 'grommet'
import { Close } from 'grommet-icons'


class Search extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentEnteredValue: "",
			currentValue: [],
		}

		this.handleOnChange = this.handleOnChange.bind(this);
		this.addOption = this.addOption.bind(this);
		this.popOption = this.popOption.bind(this);
		this.parseActiveOptions = this.parseActiveOptions.bind(this);
		this.getDynamicOptions = this.getDynamicOptions.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
	}

	handleOnChange(value) {
		this.setState({ currentValue: value });
	}

	addOption() {
		this.setState({
			currentValue: this.state.currentValue.concat([this.state.currentEnteredValue]),
			currentEnteredValue: ""
		});

	}

	popOption(option) {
		const { currentValue } = this.state;
		let copyCurrentValue = JSON.parse(JSON.stringify(currentValue));
		copyCurrentValue.pop(currentValue.indexOf(option));

		this.setState({ currentValue: copyCurrentValue });
	}

	componentDidUpdate(prevProps, prevState) {
		if (!_.isEqual(this.state.currentValue, prevState.currentValue)) {
			this.parseActiveOptions();
		}
	}

	parseActiveOptions() {
		const { currentValue } = this.state;
		var resultObject = {};

		for (var eachValue of currentValue) {
			const unparsedOptions = eachValue;
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

	getDynamicOptions() {
		const { currentEnteredValue } = this.state;

		if (currentEnteredValue.indexOf("port") === 0) {
			return {
				options: ["80", "!80", "%"],
				regexp: /^(\!{0,1}[0-9]{0,5})|%$/,
				placeholder: "value (Shift+Enter to submit)"
			}
		}
		else if (currentEnteredValue.indexOf("protocol") === 0) {
			return {
				options: ["http%", "ssh"],
				regexp: /^.+$/,
				placeholder: "value (Shift+Enter to submit)"
			}
		}
		else if (currentEnteredValue.indexOf("banner") === 0) {
			return {
				options: ["%apache%", "nginx"],
				regexp: /^.+$/,
				placeholder: "value (Shift+Enter to submit)"
			}
		}
		else if (currentEnteredValue.indexOf("ip") === 0) {
			return {
				options: ["192%", "10.10.121.25"],
				regexp: /^[0-9%]+$/,
				placeholder: "value (Shift+Enter to submit)"
			}
		}
		else if (currentEnteredValue.indexOf("host") === 0) {
			return {
				options: ["yandex.ru", "%.ru", "%.com"],
				regexp: /^.+$/,
				placeholder: "value (Shift+Enter to submit)"
			}
		}
		else if (currentEnteredValue.indexOf("files") === 0) {
			return {
				options: ["200", "401"],
				regexp: /^([0-9]{3})$/,
				placeholder: "value (Shift+Enter to submit)"
			}
		}
		else {
			return {
				options: [],
				regexp: /^$/,
				placeholder: "value (Shift+Enter to submit)"
			}
		}
	}

	render() {
		const { currentValue, currentEnteredValue } = this.state;
		const generatedOptions = this.getDynamicOptions();

		return (
			<Box
				margin={{
					top: "small"
				}}
				gap="xsmall"
			>
				<Keyboard
					onEnter={(e) => {
						if (e.shiftKey) {
							document.getElementById('maskedinput').blur();
							setTimeout(() => {
								this.addOption();
							}, 150);
						}
					}}
					onBackspace={(e) => {
						if (currentEnteredValue.indexOf(": ") == (currentEnteredValue.length - 2)) {
							this.setState({
								currentEnteredValue: ""
							});
						}
					}
					}
				>
					<MaskedInput
						id="maskedinput"
						mask={[
							{
								options: [
									"banner",
									"files",
									"host",
									"ip",
									"port",
									"protocol",
								],
								regexp: /^[a-z]+$/,
								placeholder: "type"
							},
							{ fixed: ': '},
							{
								options: generatedOptions["options"],
								regexp: generatedOptions["regexp"],
								placeholder: generatedOptions["placeholder"]
							}
						]}
						value={currentEnteredValue}
						onChange={(event) => this.setState({ currentEnteredValue: event.target.value })}
					/>
				</Keyboard>
				<Box direction="row" gap="xsmall">
					{
						currentValue.map((option) => {
							return (
								<Box
									key={option}
									align="center"
									gap="xxsmall"
									direction="row"
									pad="xsmall"
									border={{
										size: "small",
										color: "brand"
									}}
									round="xsmall"
								>
									{option} <Close size="small" onClick={() => this.popOption(option)} />
								</Box>
							);
						})
					}
				</Box>
			</Box>
		);
	}
}

export default Search;
