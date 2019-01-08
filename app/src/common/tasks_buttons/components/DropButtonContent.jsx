import _ from 'lodash'
import React from 'react'
import { Box, Button } from 'grommet'


class DropButtonContent extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
		return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
	}

	render() {
        let items = this.props.tasks.map((task) => {
			return (
                <Button
                    plain
                    hoverIndicator={true}
                    key={task.name}
                    onClick={() => { this.change_current_task(task)} }
                    label={task.name}
                />
			)
		});

		return (
			<Box pad="xsmall" gap="xxsmall">
                {items}
            </Box>
		)
	}

}

export default DropButtonContent;