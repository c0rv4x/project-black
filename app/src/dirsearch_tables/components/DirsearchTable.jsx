import _ from 'lodash'
import React from 'react'

import {
	Anchor,
	Box,
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
	Text
} from 'grommet'

import Footer from './Footer.jsx'


class DirsearchTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: true
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
	}

	componentDidUpdate(prevProps, prevState) {
		if (!_.isEqual(prevProps.files, this.props.files)) {
			this.setState({
				loaded: true
			});
		}
	}

	render() {
		const { files, stats, target_id, target, port_number } = this.props;

		let files_rows = [];
		if (files) {
			for (let each_file of files) {
				let color = null;

				if (Math.floor(each_file.status_code / 100) == 2) color = 'status-ok';
				else if (each_file.status_code == 401) color = 'status-warning';

				files_rows.push(
					<TableRow key={each_file.file_id}>
						<TableCell><Text color={color}>{each_file.status_code}</Text></TableCell>
						<TableCell><Anchor href={each_file.file_path} target="_blank">{each_file.file_name}</Anchor></TableCell>
						<TableCell><Text>{each_file.content_length}</Text></TableCell>
						<TableCell><Text>{each_file.special_note}</Text></TableCell>
					</TableRow>
				);
			}
		}

		if (stats.total) {
			return (
				<Box
					alignSelf="stretch"
					border={{
						color: "dark-3",
						size: "xsmall"
					}}
					round="small"
					margin={{
						"bottom": "small"
					}}
				>
					<Table alignSelf="stretch">
						<TableHeader>
							<TableRow>
								<TableCell>Code</TableCell>
								<TableCell>Path</TableCell>
								<TableCell>Bytes</TableCell>
								<TableCell>Redirect to</TableCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{files_rows}
						</TableBody>
					</Table>
					<Footer got_files={files_rows} {...this.props} />
				</Box>
			)
		}
		else {
			return <span></span>
		}
	}
}

export default DirsearchTable;