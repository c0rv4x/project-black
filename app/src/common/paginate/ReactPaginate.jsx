import _ from 'lodash'
import React from 'react'

import { Box } from 'grommet'
import Page from './Page.jsx'


class ReactPaginate extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeItem: this.props.pageNumber || 1
		}

		this.setPage.bind(this);
	}

	componentDidUpdate(prevProps) {
		if ((prevProps.pageNumber + 1) !== this.state.activeItem) {
			this.setState({
				activeItem: prevProps.pageNumber + 1
			})
		}
	}

	setPage(number) {
		this.setState({
			activeItem: number
		});

		this.props.clickHandler(number);
	}

	createItem(value) {
		const { activeItem } = this.state;

		if (value == '...') {
			return (
				<Page
					key={"menu-" + value}
					value={value}
					active={false}
					disabled={true}
				/>
			)
		}
		else {
			return (
				<Page
					key={"menu-" + value}
					value={String(value)}
					active={activeItem === value}
					disabled={false}
					setActive={() => {this.setPage(value)}}
				/>
			)
		}
	}

	render() {
		const { pageCount } = this.props;
		const { activeItem } = this.state;

		var pages = [];

		switch (pageCount) {
			case 0:
			case 1:
				return <div></div>
			case 2:
			case 3:
			case 4:
			case 5:
				for (var i = 1; i < pageCount + 1; i++) {
					pages.push(this.createItem(i));
				}

				break;
			default:
				if (activeItem > 3) {
					pages.push(this.createItem(1))
					pages.push(this.createItem('...'));
					pages.push(this.createItem(activeItem - 1))
				}
				else if (activeItem == 3) {
					pages.push(this.createItem(1))
					pages.push(this.createItem(activeItem - 1))
				}				
				else if (activeItem == 2) {
					pages.push(this.createItem(1))
				}
				else if (activeItem == 1) {
				}
				
				pages.push(this.createItem(activeItem))

				if (activeItem < pageCount - 2) {
					pages.push(this.createItem(activeItem + 1))
					pages.push(this.createItem('...'));
					pages.push(this.createItem(pageCount))
				}
				else if (activeItem == pageCount - 2) {
					pages.push(this.createItem(activeItem + 1))
					pages.push(this.createItem(pageCount))
				}
				else if (activeItem == pageCount - 1) {
					pages.push(this.createItem(pageCount))
				}
				else if (activeItem == pageCount) {

				}

				break;
		}

		return (
			<Box direction="row">
				{pages}
			</Box>
		)
	}
}

export default ReactPaginate;