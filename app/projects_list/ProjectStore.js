var _ = require('lodash');
var Reflux = require('reflux');
var io = require('socket.io-client');
var socket = io();
var ProjectActions = require('./ProjectActions.js');

var initialState = {
    loading: false,
    errorMessage: '',
    users: [],
};

module.exports = Reflux.createStore({

    listenables: [ProjectActions],

    init() {
        socket.on('connect', () => {
            this.fetchUsers();
        });
    },

    getInitialState() {
        return this.state = initialState;
    },

    fetchUsers() {
        this.state.errorMessage = '';
        this.state.loading = true;
        socket.emit('users:all', this.updateUsers.bind(this));
    },

    updateUsers(err, users) {
        this.state.errorMessage = '';
        this.state.loading = false;

        if (err) {
            console.error('Error updating users:', err);
            this.state.errorMessage = err;
            this.trigger(this.state);
            return;
        }

        this.state.users = users;
        this.trigger(this.state);
    },

    onDelete(userID) {

        var user = _.find(this.state.users, { id: userID });

        // Indicate the user is being updated.
        this.state.errorMessage = '';
        this.state.loading = true;
        this.trigger(this.state);

        socket.emit(
            'users:delete',
            userID,
            function (err) {
                // The callback has been fired so indicate the request has finished.
                user.loading = false;

                if (err) {
                    console.error('Error deleting user:', err);
                    this.state.errorMessage = err;
                    this.trigger(this.state);
                    return;
                }

                // TODO: Delete the user from the list of users here...
                this.trigger(this.state);
            }.bind(this)
        );
    },
});