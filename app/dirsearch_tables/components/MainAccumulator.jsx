import React from 'react'

import MainTable from './MainTable.jsx'


class MainAccumulator extends React.Component {
	constructor(props) {
		super(props);

	}

componentWillMount() {
  setTimeout(() => {
    window.Perf.start();
    setTimeout(() => {
      window.Perf.stop();
      window.measurements = window.Perf.getLastMeasurements();
      window.Perf.printWasted(window.measurements);
      window.Perf.printInclusive(window.measurements);
      window.Perf.printExclusive(window.measurements);
    }, 30000);
  }, 5000);
}	
	render() {
		return (
			<div>
				<h2>{this.props.project.project_name}</h2>
				<MainTable ips={this.props.ips}
						   hosts={this.props.hosts}
						   ports={this.props.ports}
						   files={this.props.files} />
			</div>
		)
	}
}

export default MainAccumulator;