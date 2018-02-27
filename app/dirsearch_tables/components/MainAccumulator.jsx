import React from 'react'

import { Header } from 'semantic-ui-react'

import MainTable from './MainTable.jsx'

import Perf from 'react-addons-perf'

class MainAccumulator extends React.Component {
	constructor(props) {
		super(props);
	}

componentDidMount() {
    // We have to push it to the next tick otherwise React Native would have
    // problems with the WorkerPerformance
    setTimeout(() => {
      Perf.start();

      // Some arbitrary time for metrics
      setTimeout(() => {
        Perf.stop();
        Perf.printInclusive();
        Perf.printExclusive();
      }, 25000);

    }, 0);
}	


	render() {
		const { ips, hosts, project } = this.props;

		return (
			<div>
				<Header as="h2">{project.project_name}</Header>
				<MainTable ips={ips}
						   hosts={hosts}
						   project_uuid={project.project_uuid} />
			</div>
		)
	}
}

export default MainAccumulator;