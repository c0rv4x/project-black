import _ from 'lodash'
import React from 'react'

import TitleButtonsWithHandlers from './TitleButtonsWithHandlers.jsx'
import ProjectCommentTracked from './ProjectCommentTracked.jsx'
import IPTableTracked from './IPTableTracked.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'

let p;
class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);
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

  	shouldComponentUpdate(nextProps) {
  		return (!_.isEqual(nextProps, this.props))
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
				<ProjectCommentTracked project={this.props.project} />
				<IPTableTracked scopes={this.props.scopes}
								scans={this.props.scans} />
			</div>
		)
	}
}

export default ProjectDetails;
