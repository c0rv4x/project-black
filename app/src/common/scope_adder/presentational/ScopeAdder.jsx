import React from 'react'
import PropTypes from 'prop-types';
import { createScope } from '../../../redux/scopes/actions'

import ScopeUpload from '../components/ScopeUpload.jsx'
import { Button, Heading, TextArea } from 'grommet'

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
			autosize(this.input);
		}
	}

	render() {
		const { scopesCreated } = this.props;

		return (
			<div>
				<Heading level="3">Add new scope</Heading>
				<TextArea 
					autoHeight
					rows={1}
					type="text"
					placeholder="Newline-separated hosts, ips, networks (CIDR notation)"
					value={this.props.newScopeInput}
					onKeyUp={this.handleKeyPress}
					onChange={(e) => this.props.handleNewScopeChange(e.target.value)}
				/>

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
			</div>
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