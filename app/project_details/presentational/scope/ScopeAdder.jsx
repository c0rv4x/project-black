import React from 'react'
import { 
	Button,
	FormGroup,
	ControlLabel,
	FormControl
} from 'react-bootstrap'


class ScopeAdder extends React.Component {

	constructor(props) {
		super(props);

		this.target = {
			"errortext": ""
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

	render() {
		return (

			<form>
				<FormGroup controlId="formBasicText"
     					   validationState={this.findScopeType()}>

					<ControlLabel>Add new scope</ControlLabel>

					<FormControl type="text" 
								 placeholder="Enter hostname or IP address." 
								 value={this.props.newScopeInput}
								 onChange={this.props.handleNewScopeChange}/>
  		            <FormControl.Feedback />

				</FormGroup>

				<Button bsStyle="default" 
						onClick={() => this.props.onNewScopeClick(this.props.newScopeInput)}>
						Add to scope
				</Button>
			</form>
		)
	}
}

export default ScopeAdder;