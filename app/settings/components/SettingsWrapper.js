import _ from 'lodash'
import { connect } from 'react-redux'

import Settings from './Settings.jsx'


function mapStateToProps(state, ownProps) {
    return {
    }
}


const SettingsWrapper = connect(
	mapStateToProps
)(Settings)

export default SettingsWrapper
