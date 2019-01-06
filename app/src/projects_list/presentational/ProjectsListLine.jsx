import _  from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'

import { Box, Button, Grid, TableRow, TableCell } from 'grommet'
import { Inspect, Trash } from 'grommet-icons'

class ProjectsListLine extends React.Component
{

    constructor(props) {
        super(props);
    }

    delete_project(project_uuid) {
        if (confirm("Are you sure you want to delete?")) {
            this.props.onDelete(project_uuid);
        }
    }

    render() {
        const { project } = this.props;

        return (
            <TableRow>
                <TableCell>{project.project_uuid}</TableCell>
                <TableCell>{project.project_name}</TableCell>
                <TableCell>
                    <Grid
                        columns={{
                            count: 2,
                            size: 'auto'
                        }}
                    >
                        <Box>
                            <Link to={"/project/" + project.project_uuid}>
                                <Button hoverIndicator={true} icon={<Inspect />} />
                            </Link>
                        </Box>
                        <Box>
                            <Button
                                onClick={
                                    () => {
                                        this.delete_project(project.project_uuid);
                                    }
                                }
                                hoverIndicator={true}
                                icon={<Trash />}
                            />
                        </Box>
                    </Grid>
                </TableCell>
            </TableRow>
        )
    }

}

export default ProjectsListLine;
