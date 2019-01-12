import React from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import PropTypes from 'prop-types';

import { Box, Text } from 'grommet'

import { notifDismiss } from '../../redux/notifications/actions';


// This checks to see if object is immutable and properly access it
const getter = (obj, propName) => (obj.get ? obj.get(propName) : obj[propName]);

class Notifications extends React.Component {
    constructor(props, store) {
        super(props);
    }

    render() {
        const { notifications, store } = this.props;
        const renderedNotifications = notifications.map((notification) => {
            let color = 'brand';
            let kind = getter(notification, 'kind');
            let id = getter(notification, 'id');

            if (kind === 'success') color = 'status-ok'
            else if (kind === 'error') color = 'status-critical'

            return (
                <Box
                    key={id}
                    id={id}
                    background={color}
                    round="medium"
                    pad={{ vertical: "xsmall", horizontal: "small" }}
                    onClick={() => {store.dispatch(notifDismiss(id))}}
                >
                    <Text>{getter(notification, 'message')}</Text>
                </Box>
            )
        });

        return (
            <div className="notif__container">
                <CSSTransitionGroup
                    transitionName="notif-transition"
                    transitionEnterTimeout={600}
                    transitionLeaveTimeout={600}
                >
                    {renderedNotifications}
                </CSSTransitionGroup>
            </div>
        )
    }
}

function mapStateToProps(state) {
  return { notifications: state.get ? state.get('notifs') : state.notifs };
}

export default connect(mapStateToProps)(Notifications);