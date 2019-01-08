import _ from 'lodash'
import React from 'react'
import { Box, Button } from 'grommet'


class DropButtonContent extends React.Component {
	render() {
        let items = this.props.tasks.map((task) => {
			return (
                <Button
                    plain
                    hoverIndicator={true}
                    key={task.name}
                    onClick={() => {
                        this.props.onClose();
                        this.props.changeCurrentTask(task)}
                    }
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