import React from 'react'

import CredsSocketioEventsEmitter from '../../redux/creds/CredsSocketioEventsEmitter'

import {
    Box,
    Button,
    DataTable,
    DropButton,
    Heading,
    Layer,
    Stack,
    ThemeContext
} from 'grommet'
import { Trash, UserAdmin } from 'grommet-icons'

class Creds extends React.Component {
    constructor(props) {
        super(props);

		this.state = {
            layerOpened: false,
			data: [],
            inited: false
        };

        this.credsEmitter = new CredsSocketioEventsEmitter();
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
				data: scope.creds.values,
				inited: true
			});
		}
		else {
			if (prevProps.scope.creds.values !== scope.creds.values) {
				this.setState({
					data: scope.creds.values,
				});
			}
		}
	}

    render() {
        if (this.state.data.length) {
            const { scope, project_uuid } = this.props;
            const { data } = this.state;

            let ports = [];

            for (let cred of data) {
                let port_number = cred.port_number;

                if (ports.indexOf(port_number) === -1) {
                    ports.push(port_number);
                }
            }

            return (
                <div>
                    <Stack
                        anchor="top-right"
                        onClick={() => this.setState({ layerOpened: true })}
                    >
                        <Button icon={<UserAdmin />} />
                        <Box
                            border={{ size: "xsmall", color: "brand" }}
                            round="xlarge"
                            background="brand"
                            pad={{ left: "xxsmall", right: "xxsmall" }}
                        >
                            {scope.creds.values.length}
                        </Box>
                    </Stack>
                    { this.state.layerOpened && (
                        <Layer
                            position="center"
                            modal
                            onClickOutside={() => this.setState({ layerOpened: false })}
                            onEsc={() => this.setState({ layerOpened: false })}
                        >
                            <Box pad="medium" gap="small" >
                                <Box direction="row">
                                    <Box>
                                        <Heading margin="none" level="3">{scope.target}</Heading>
                                    </Box>
                                    <Box fill="horizontal" align="end">
                                        <ThemeContext.Extend value={{
                                            global: { edgeSize: { small: '0px' } }
                                        }}>
                                            <DropButton
                                                disabled={ports.length <= 0}
                                                dropContent={(
                                                    <Box gap="small" margin="xsmall">
                                                        { ports.length > 0 &&
                                                            ports.map((port_number) => {
                                                                return (
                                                                    <div
                                                                        key={port_number}
                                                                        onClick={() => {
                                                                            this.deleteCreds(port_number);
                                                                        }}
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        {port_number} port
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </Box>
                                                )}
                                                dropAlign={{ top: "bottom" }}
                                                icon={<Trash color="status-critical" />}
                                            />
                                        </ThemeContext.Extend>  
                                    </Box>
                                </Box>
                                <DataTable
                                    columns={[
                                        {
                                            property: "port_number",
                                            header: "Port",
                                            primary: true
                                        },
                                        {
                                            property: "service",
                                            header: "Service"
                                        },
                                        {
                                            property: "code",
                                            header: "Code"
                                        },
                                        {
                                            property: "candidate",
                                            header: "Candidate"
                                        },
                                        {
                                            property: "message",
                                            header: "Message"
                                        },
                                        
                                    ]}
                                    data={data}
                                    sortable
                                    resizeable
                                />
                            </Box>
                        </Layer>
                    ) }
                </div>
            );
        }
        else {
            return <div></div>
        }
    }
}

export default Creds;