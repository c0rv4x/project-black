import React from 'react'

import {
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

		this.handleSortClick = this.handleSortClick.bind(this);
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
		if (!this.state.inited) {
			this.setState({
				column: null,
				data: this.props.ip.creds,
				direction: null,				
				inited: true
			});
		}
		else {
			if (prevProps.ip.creds !== this.props.ip.creds) {
				this.setState({
					column: null,
					data: this.props.ip.creds,
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
            const { ip } = this.props;
            const { column, data, direction } = this.state;
        
            return (
                <Modal 
                    trigger={<Label as="a">Accounts<Label.Detail>{ip.creds.length}</Label.Detail></Label>}
                >
                    <Modal.Header>{ip.ip_address}</Modal.Header>
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