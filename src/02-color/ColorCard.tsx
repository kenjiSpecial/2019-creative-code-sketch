import { Component } from 'react';
import * as React from 'react';
import { IColor } from './state/Color/types';
import TweenMax, { Expo, Power4 } from 'gsap/TweenMax';
import { store } from './state/index';
import { selectColor } from './state/Color/actions';
interface IProps {
	color: IColor;
	index: number;
}

interface IState {
	opacity: number;
}

export class ColorCard extends Component<IProps, IState> {
	state = {
		opacity: 0
	};
	private animation = {
		opacity: 0
	};
	el = React.createRef<HTMLDivElement>();

	componentDidMount() {
		this.onClickHandler = this.onClickHandler.bind(this);
		TweenMax.from(this.el.current, 1.2, {
			opacity: 0,
			y: '+40',
			ease: Power4.easeOut,
			delay: 0.08 * this.props.index
		});
	}
	onClickHandler() {
        console.log('onClick');
		store.dispatch(selectColor(this.props.color))
		
    }
	render() {
		return (
			<div
				ref={this.el}
				style={{
					width: 120,
					height: 120,
					margin: 10,
					background: `rgb(${this.props.color.r}, ${this.props.color.g}, ${this.props.color.b})`,
					cursor: 'pointer',
					opacity: 1
				}}
				onClick={this.onClickHandler}
			></div>
		);
	}
}
