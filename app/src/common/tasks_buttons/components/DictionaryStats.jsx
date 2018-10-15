import _ from 'lodash'
import React from 'react'
import {
    Button,
    Header,
    Table
} from 'semantic-ui-react'


class DictionariesStats extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { dicts } = this.props;
 
        if (dicts.dicts.length) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Lines Count</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {dicts.dicts.map((x) => {
                            return (
                                <Table.Row key={x.id}>
                                    <Table.Cell>{x.name}</Table.Cell>
                                    <Table.Cell>{x.lines_count}</Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            onClick={() => {
                                                window.open(
                                                    '/dictionary/' + x.id,
                                                    Math.random().toString(36).substring(7),
                                                    'width=850,height=700'
                                                )
                                            }}
                                        >
                                            Show
                                        </Button>                                        
                                        <Button
                                            color="red"
                                            onClick={(x) => {
                                                if (confirm("Delete this dictionary?")) {
                                                    this.props.deleteDict(x.id);
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            )
        }
        else {
            return <Header as="h4">No dictionaries. Upload a new one!</Header>;
        }

	}

}

export default DictionariesStats;




