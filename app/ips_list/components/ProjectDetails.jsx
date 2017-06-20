import _ from 'lodash'
import React from 'react'

import TitleButtonsWithHandlers from './TitleButtonsWithHandlers.jsx'
import ProjectCommentTracked from './ProjectCommentTracked.jsx'
import ScopeTableTracked from './ScopeTableTracked.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'


class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);

		console.log('ProjectDetails.constructor');
	}

  // componentDidMount() {
  //   setTimeout(() => {
  //     window.Perf.start();
  //     setTimeout(() => {
  //       window.Perf.stop();
  //       window.measurements = window.Perf.getLastMeasurements();
  //       window.Perf.printWasted(window.measurements);
  //     }, 30000);
  //   }, 5000);
  // }	

	componentWillReceiveProps(nextProps) {
		console.log('+++++++');
		console.log('----componentWillReceiveProps');
		if (_.filter(nextProps.scopes.ips, (x) => {
        	return x.comment.indexOf('secret') !== -1
	    }).length > 0) {
			console.log('newprops has secret');
	    }		
		if (_.filter(this.props.scopes.ips, (x) => {
        	return x.comment.indexOf('secret') !== -1
	    }).length > 0) {
			console.log('this.props has secret');
	    }			
		if (!_.isEqual(nextProps, this.props)) {
		console.log('ProjectDetails props are new', nextProps);

		}
	}

	render() {
		return (
			<div>
				<h4>Working with ips (usually, network level utilities are run here)</h4>
				<TitleButtonsWithHandlers scopes={this.props.scopes}
								   project={this.props.project} 
								   scans={this.props.scans} />

				<hr/>

				<h3>{this.props.project.project_name}</h3>
				<Tasks tasks={this.props.tasks} />
				<ProjectCommentTracked project={this.props.project}
									   onCommentChange={this.props.onProjectCommentChange} />
				<ScopeTableTracked scopes={this.props.scopes}

								   scans={this.props.scans} />
			</div>
		)
	}
}

export default ProjectDetails;
