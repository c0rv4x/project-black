import _ from 'lodash'
import React from 'react'

import { Box, Button, Stack, Text } from 'grommet'
import { Google, Inspect, Tasks } from 'grommet-icons'
import Creds from '../../../common/creds/Creds.jsx'


class HidingButtons extends React.Component {
	render() {
        const { project_uuid, scope, type, target } = this.props;
        const verbose_host_link = '/project/' + project_uuid + '/' + type + '/' + target;

		return (
            <Box direction="row" align="center">
                <Creds
                    scope={scope}
                    project_uuid={project_uuid}
                />
                <Button
                    onClick={() => window.open("https://google.com/search?q=site:" + target, Math.random().toString(36).substring(7))}
                    icon={<Google size="medium" />}
                />
                <Button
                    onClick={() => window.open(verbose_host_link, Math.random().toString(36).substring(7), 'width=850,height=700')}
                    icon={<Inspect size="medium" />}
                />
            </Box>
		)	
	}
}

export default HidingButtons;