import _ from 'lodash'
import React from 'react'

import {
	Box,
	Button,
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
	TableFooter
} from 'grommet'
import {
	Add
} from 'grommet-icons'

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
		console.log(files);
		if (files) {
			for (let each_file of files) {
				let status_code_style = {
					color: null
				};

				if (Math.floor(each_file.status_code / 100) == 2) status_code_style.color = '#22CF22';
				else if (each_file.status_code == 401) status_code_style.color = '#F4DF42';
				else status_code_style.color = '#333333';

				files_rows.push(
					<TableRow key={each_file.file_id}>
						<TableCell style={status_code_style}>{each_file.status_code}</TableCell>
						<TableCell><a href={each_file.file_path} target="_blank">{each_file.file_name}</a></TableCell>
						<TableCell>{each_file.content_length}</TableCell>
						<TableCell>{each_file.special_note}</TableCell>
					</TableRow>
				);
			}
		}

		if (stats.total) {
			return (
				<Box alignSelf="stretch">
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