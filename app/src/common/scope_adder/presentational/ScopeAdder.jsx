import React from 'react'
import PropTypes from 'prop-types';
import { createScope } from '../../../redux/scopes/actions'

import { Form, Button, TextArea, Header, Segment } from 'semantic-ui-react'
import ScopeUpload from '../components/ScopeUpload.jsx'


class ScopeAdder extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			"color": "blue",
			"loading": false
		};

		this.submitNewScope = this.submitNewScope.bind(this);
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

	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.scopesCreated == "error") {
			this.setState({
				color: "red",
				loading: false
			});

			this.context.store.dispatch(
				createScope(
					{"status": null, "project_uuid": this.props.project_uuid},
					this.props.project_uuid
				)
			);
		}
		else 
		if (nextProps.scopesCreated == "success") {
			this.setState({
				color: "green",
				loading: false
			});
			this.context.store.dispatch(
				createScope(
					{"status": null, "project_uuid": this.props.project_uuid},
					this.props.project_uuid
				)
			);
		}
	}

	submitNewScope() {
		this.setState({
			color: "orange",
			loading: true,
			forceStateColor: true
		});
		this.props.onNewScopeClick(this.props.newScopeInput);
	}

	render() {
		let { color, loading } = this.state;

		return (
			<Segment>
				<Form>
					<Form.Field>
						<Header as="h3">Add new scope</Header>
						<TextArea 
							autoHeight
							rows={1}
							type="text"
							placeholder="Newline-separated hosts, ips, networks (CIDR notation)"
							value={this.props.newScopeInput}
							onChange={(e) => this.props.handleNewScopeChange(e.target.value)}
							onKeyUp={(e) => {
								if (e.key === 'Enter' && e.shiftKey) {         
									this.submitNewScope();
								}
							}}
						/>
					</Form.Field>

					<ScopeUpload
						fileLoadedHandler={this.props.handleNewScopeChange}
					>
						Upload scope
					</ScopeUpload>

					<Button
						color={color}
						loading={loading}
						active={loading}
						onClick={this.submitNewScope}
					>
							Add to scope
					</Button>
				</Form>
			</Segment>
		)
	}
}

ScopeAdder.contextTypes = {
    store: PropTypes.object
}

export default ScopeAdder;
