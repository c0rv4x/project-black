import _ from 'lodash'
import React from 'react'
import { Menu } from 'semantic-ui-react'


class ReactPaginate extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeItem: 1
		}

		this.setPage.bind(this);
	}

	setPage(number) {
		this.setState({
			activeItem: number
		});

		this.props.clickHandler(number);
	}

	createItem(i) {
		const { activeItem } = this.state;

		return (
			<Menu.Item key={i}
					   name={String(i)}
					   active={activeItem === i}
			           onClick={() => {this.setPage(i)}} />
		)
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
				for (var i = 1; i < pageCount; i++) {
					pages.push(this.createItem(i));
				}

				break;
			default:
				if (activeItem > 3) {
					pages.push(this.createItem(1))
					pages.push(<Menu.Item key={0} disabled>...</Menu.Item>);
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
					pages.push(<Menu.Item key={pageCount + 1} disabled>...</Menu.Item>);
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
			<Menu pagination>
				{pages}
			</Menu>
		)
	}
}

export default ReactPaginate;