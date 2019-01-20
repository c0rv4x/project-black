import _ from 'lodash'
import React from 'react'

import { Box } from 'grommet'


class Page extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
	}

	render() {
        const { value, active, disabled, setActive }= this.props;

        return (
			<Box
                pad="small"
                style={{ cursor: !disabled ? 'pointer' : 'default' }}
                background={ active ? "brand" : "" }
                onClick={setActive}
            >
				{value}
			</Box>
		)
	}
}

export default Page;