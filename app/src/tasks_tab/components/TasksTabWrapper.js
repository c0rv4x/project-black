import _ from 'lodash';
import { connect } from 'react-redux';

import TasksTab from './TasksTab.jsx';


function mapStateToProps(state, ownProps){
    return {
        project_uuid: state.project_uuid,
        tasks: state.tasks
    }
}


const TasksTabWrapper = connect(
    mapStateToProps
)(TasksTab)

export default TasksTabWrapper;
