import _ from 'lodash'
import React from 'react'

import { Box, Text, DropButton } from 'grommet'
import { More } from 'grommet-icons'


const DropContent = ({ doExport }) => (
    <Box pad="small">
        <Text
            style={{ cursor: "pointer" }}
            onClick={doExport}
        >
            Export selected IPs in oG format
        </Text>
    </Box>
);


class OtherIPsButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }

	render() {
        const { open } = this.state;

		return (
            <DropButton
                hoverIndicator={true}
                icon={<More />}
                open={open}
                onClose={() => this.setState({ open: false })}
                onOpen={() => this.setState({ open: true })}
                dropAlign={{ top: "bottom" }}
                dropContent={<DropContent doExport={this.props.doExport} />}
            />
		)	
	}
}

export default OtherIPsButton;