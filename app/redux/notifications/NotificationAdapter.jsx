import React from 'react'
import { Message } from 'semantic-ui-react'

class NotificationAdapter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { kind, header, message } = this.props;
        let color = null;
        if (kind == 'success') color = 'green'
        else if (kind == 'error') color = 'red'
        return (
            <Message
                color={color}
                header={header}
            >
                {message}
            </Message>
        )
    }
}

export default NotificationAdapter;