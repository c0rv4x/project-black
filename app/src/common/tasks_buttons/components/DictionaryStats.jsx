import _ from 'lodash'
import React from 'react'

import {
    Box,
    Button,
    Heading,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableFooter
} from 'grommet'
import { Inspect, Trash } from 'grommet-icons'

import DictUploader from './DictUploader.jsx'


class DictionariesStats extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { dicts } = this.props;
 
        return (
            <Box>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Lines Count</TableCell>
                            <TableCell>Control</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dicts.dicts.map((x) => {
                            return (
                                <TableRow key={x.id}>
                                    <TableCell>{x.name}</TableCell>
                                    <TableCell>{x.lines_count}</TableCell>
                                    <TableCell>
                                        <Box direction="row">
                                            <Button
                                                onClick={() => {
                                                    window.open(
                                                        '/dictionary/' + x.id,
                                                        Math.random().toString(36).substring(7),
                                                        'width=850,height=700'
                                                    )
                                                }}
                                                icon={<Inspect />}
                                            />
                                            <Button
                                                onClick={(x) => {
                                                    if (confirm("Delete this dictionary?")) {
                                                        this.props.deleteDict(x.id);
                                                    }
                                                }}
                                                icon={<Trash />}
                                            />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <DictUploader
                            project_uuid={this.props.project_uuid}
                            task_name={this.props.name}
                            renewDicts={this.renewDicts}
                        />
                    </TableFooter>
                </Table>
            </Box>
        )
	}

}

export default DictionariesStats;




