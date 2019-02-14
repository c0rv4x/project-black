import React from 'react'
import PropTypes from 'prop-types';

import autosize from 'autosize'

import ScopeUpload from '../components/ScopeUpload.jsx'
import { Box, Button, Heading, TextArea } from 'grommet'

class ScopeAdder extends React.Component {

	constructor(props) {
		super(props);
		
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleKeyPress(e) {
		if (e.key === 'Enter' && e.shiftKey) {         
			this.props.onNewScopeClick(this.props.newScopeInput);
		}
	}

	findScopeType() {
	    function tryip_addressNetwork(target) {
	        return target.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/[0-9]{1,2}$/);
	    }

	    function tryip_addressAddress(target) {
	        return target.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/);
	    }

	    function tryHostname(target) {
	        return target.match(/^([a-zA-Z]{1}[a-zA-Z0-9\-]{0,255}\.){1,}[a-zA-Z]{2,15}$/);
	    }

		const target = this.props.newScopeInput;

		if (target.length) {
			for (var scope of target.split(',')) {
				const trimmedTarget = scope.trim();

			    if (tryip_addressNetwork(trimmedTarget)) continue
			    else if (tryip_addressAddress(trimmedTarget)) continue
			    else if (tryHostname(trimmedTarget)) continue
			    else {
			        return "error";
			    }
			}

			return 'success';
		}
	}

	submitNewScope() {
		this.props.onNewScopeClick(this.props.newScopeInput);
	}

	componentDidUpdate() {
		if (this.input) {
			autosize.update(this.input);
		}
	}

	componentDidMount() {
		if (this.input) {
			autosize(this.input);
		}
	}

	render() {
		const { scopesCreated } = this.props;

		return (
			<Box
				border={{
					size: "small",
					color: "light-4"
				}}
				round="xsmall"
				pad="small"
				margin={{
					top: 'none',
					bottom: 'small',
					left: 'small',
					right: 'small'
				}}
			>
				<Heading
					level="5"
					margin={{
						top: "none",
						bottom: "small"
					}}
				>
					Add IPs, Hosts or CIDR separated with newline
				</Heading>
				<TextArea 
					ref={(input) => {
						this.input = input;
					}}
					rows={1}
					type="text"
					placeholder="1.1.1.1"
					value={this.props.newScopeInput}
					onKeyUp={this.handleKeyPress}
					onChange={(e) => this.props.handleNewScopeChange(e.target.value)}
					style={{ resize: 'none' }}
				/>

				<Box
					direction="row"
					gap="xsmall"
					margin={{ top: 'small' }}
				>
					<ScopeUpload
						fileLoadedHandler={this.props.handleNewScopeChange}
						label="Upload scope"
					/>

					<Button
						label="Add to scope"
						color={scopesCreated ? 'brand' : 'status-warning'}
						active={!scopesCreated}
						disabled={!scopesCreated}
						onClick={() => this.props.onNewScopeClick(this.props.newScopeInput)}
					/>
				</Box>
			</Box>
		)
	}
}

ScopeAdder.contextTypes = {
    store: PropTypes.object
}

export default ScopeAdder;


// <ScopeUpload
// fileLoadedHandler={this.props.handleNewScopeChange}
// >
// Upload scope
// </ScopeUpload>