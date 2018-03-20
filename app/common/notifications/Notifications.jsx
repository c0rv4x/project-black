import React from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import PropTypes from 'prop-types';

import { Message } from 'semantic-ui-react'

// This checks to see if object is immutable and properly access it
const getter = (obj, propName) => (obj.get ? obj.get(propName) : obj[propName]);

class Notifications extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { notifications } = this.props;
        console.log(notifications);
        const renderedNotifications = notifications.map((notification) => {
            return (
                <Message
                  key={getter(notification, 'id')}
                  id={getter(notification, 'id')}
                  kind={getter(notification, 'kind')}
                >
                    {getter(notification, 'message')}
                </Message>
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