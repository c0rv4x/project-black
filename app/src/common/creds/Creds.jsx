import React from 'react'

import CredsSocketioEventsEmitter from '../../redux/creds/CredsSocketioEventsEmitter'

import {
    Button,
    Dropdown,
    Grid,
    Label,
    Modal,
    Table
} from 'semantic-ui-react'


class Creds extends React.Component {
    constructor(props) {
        super(props);

		this.state = {
			column: null,
			data: [],
            direction: null,
            inited: false
        };

        this.credsEmitter = new CredsSocketioEventsEmitter();
        this.handleSortClick = this.handleSortClick.bind(this);
        this.deleteCreds = this.deleteCreds.bind(this);
    }

    deleteCreds(port_number) {
        const { scope, project_uuid } = this.props;

        this.credsEmitter.deleteCreds(project_uuid, scope.target, port_number);
    }

	shouldComponentUpdate(nextProps, nextState) {
        return ((!_.isEqual(nextProps, this.props)) || ((!_.isEqual(nextState, this.state))) || (!this.state.inited));
    }

	componentDidMount() {
		if (!this.state.inited) {
			this.forceUpdate();
		}
	}

	componentDidUpdate(prevProps) {
        const { scope } = this.props;

		if (!this.state.inited) {
			this.setState({
				column: null,
				data: scope.creds.values,
				direction: null,				
				inited: true
			});
		}
		else {
			if (prevProps.scope.creds.values !== scope.creds.values) {
				this.setState({
					column: null,
					data: scope.creds.values,
					direction: null
				});
			}
		}
	}

	handleSortClick(clickedColumn) {
		const { column, data, direction } = this.state

		if (column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				data: _.sortBy(data, [clickedColumn]),
				direction: 'ascending',
			});
	  
			return
		}
	  
		this.setState({
			data: data.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending',
		})
	}    

    render() {
        if (this.state.data.length) {
            const { scope, project_uuid } = this.props;
            const { column, data, direction } = this.state;

            let ports = [];

            for (let cred of data) {
                let port_number = cred.port_number;

                if (ports.indexOf(port_number) === -1) {
                    ports.push(port_number);
                }
            }

            return (
                <Modal 
                    trigger={<Label as="a">Accounts<Label.Detail>{scope.creds.values.length}</Label.Detail></Label>}
                >
                    <Modal.Header>
                        <Grid className="ui-header">
                            <Grid.Column floated='left'>
                                {scope.target}
                            </Grid.Column>
                            <Grid.Column textAlign='right' floated='right' width={3} >
                                <Dropdown text='Clear' icon='trash' size="big" labeled button className='icon'>
                                    <Dropdown.Menu>
                                    {
                                        ports.map((port_number) => {
                                            return (
                                                <Dropdown.Item
                                                    key={port_number}
                                                    onClick={() => {
                                                        this.deleteCreds(port_number);
                                                    }}
                                                >
                                                    {port_number} port
                                                </Dropdown.Item>
                                            );
                                        })
                                    }
                                    </Dropdown.Menu>
                                </Dropdown>                            
                            </Grid.Column>                            
                        </Grid>
                    </Modal.Header>
                    <Modal.Content>
                        <Table sortable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        sorted={column === 'port_number' ? direction : null}
                                        onClick={() => {this.handleSortClick('port_number')}}
                                        width={1}
                                    >
                                        Port
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column === 'service' ? direction : null}
                                        onClick={() => {this.handleSortClick('service')}}
                                        width={2}
                                    >
                                        Service
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column === 'code' ? direction : null}
                                        onClick={() => {this.handleSortClick('code')}}
                                        width={1}
                                    >
                                        Code
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column === 'candidate' ? direction : null}
                                        onClick={() => {this.handleSortClick('candidate')}}
                                        width={5}
                                    >
                                        Candidate
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column === 'size' ? direction : null}
                                        onClick={() => {this.handleSortClick('size')}}
                                        width={1}
                                    >
                                        Size
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column === 'mesg' ? direction : null}
                                        onClick={() => {this.handleSortClick('mesg')}}
                                        width={6}
                                    >
                                        Message
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {_.map(data, ({ id, target, port_number, service, code, candidate, size, mesg}) => {
                                    return (
                                        <Table.Row key={"cred_" + target + "_" + id}>
                                            <Table.Cell>{port_number}</Table.Cell>
                                            <Table.Cell>{service}</Table.Cell>
                                            <Table.Cell>{code}</Table.Cell>
                                            <Table.Cell>{candidate}</Table.Cell>
                                            <Table.Cell>{size}</Table.Cell>
                                            <Table.Cell>{mesg}</Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </Modal.Content>
                </Modal>
            );
        }
        else {
            return <div></div>
        }
    }
}

export default Creds;