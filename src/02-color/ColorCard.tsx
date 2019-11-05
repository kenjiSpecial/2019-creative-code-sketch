import { Component } from 'react';
import * as React from 'react';
import { IColor } from './state/Color/types';
import TweenMax, { Expo, Power4 } from 'gsap/TweenMax';
import { store } from './state/index';
import { selectColor, removeColor } from './state/Color/actions';
import { Firebase } from './firebase/firebase';
import { Unsubscribe } from 'redux';
import { Page } from './state/App/types';
interface IProps {
	color: IColor;
}

interface IState {
	opacity: number;
	cursor: string;
	top: number;
	left: number;
}

export class ColorCard extends Component<IProps, IState> {
	state = {
		opacity: 0,
		cursor: 'pointer',
		top: 0,
		left: 0
	};
	el = React.createRef<HTMLDivElement>();
	unsubscribe: Unsubscribe;
	constructor(props: IProps) {
		super(props);

		this.onClickHandler = this.onClickHandler.bind(this);
		this.onResizeHandler = this.onResizeHandler.bind(this);
	}

	componentDidMount() {
		TweenMax.from(this.el.current, 0.9, {
			opacity: 0,
			y: '+120',
			ease: Power4.easeOut,
			delay: 0.08 * this.props.color.index
		});

		this.unsubscribe = store.subscribe(() => {
			if (!store.getState().color.isSelctable) {
				this.animateOut();
			}

			if (store.getState().app.page === Page.RESULT) {
				this.animateOut();
			}
		});

		this.onResizeHandler();
		window.addEventListener('resize', this.onResizeHandler);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResizeHandler);
	}

	onClickHandler() {
		if (!store.getState().color.isSelctable) {
			return;
		}
		store.dispatch(selectColor(this.props.color));
		const firebase = Firebase.GET_INSTANCE();
		firebase.updateColor(this.props.color);
	}

	onResizeHandler() {
		const left = window.innerWidth / 2 - 60 - 150 * (-this.props.color.index + 2);
		const top = window.innerHeight / 2 - 60;
		this.setState({
			top: top,
			left: left
		});
	}

	animateOut() {
		this.unsubscribe();
		TweenMax.killTweensOf(this.el.current);
		TweenMax.to(this.el.current, 0.6, {
			opacity: 0,
			y: '-80',
			ease: Power3.easeIn,
			delay: 0.08 * this.props.color.index,
			onComplete: () => {
				store.dispatch(removeColor(this.props.color));
			}
		});
	}
	render() {
		return (
			<div
				ref={this.el}
				style={{
					width: 120,
					height: 120,
					background: `rgb(${this.props.color.r}, ${this.props.color.g}, ${this.props.color.b})`,
					cursor: this.state.cursor,
					position: 'absolute',
					top: this.state.top,
					left: this.state.left
				}}
				onClick={this.onClickHandler}
			></div>
		);
	}
}
