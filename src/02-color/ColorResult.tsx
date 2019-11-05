import { Component } from 'react';
import * as React from 'react';
import { IColor, ColorState } from './state/Color/types';
import TweenMax, { Expo, Power4 } from 'gsap/TweenMax';
import { store } from './state/index';
import { selectColor, removeColor, selectColors, updateColor } from './state/Color/actions';
import { Firebase } from './firebase/firebase';
import { Unsubscribe } from 'redux';
import { Page, AppState } from './state/App/types';
interface IProps {}

interface IState {
	opacity: number;
	top: number;
	left: number;
	width: number;
	height: number;
	color: { r: number; g: number; b: number };
}

export class ColorResult extends Component<IProps, IState> {
	state = {
		opacity: 0,
		top: 0,
		left: 0,
		width: 0,
		height: 0,
		color: { r: 0, g: 0, b: 0 }
	};
	el = React.createRef<HTMLDivElement>();
	unsubscribe: Unsubscribe;

	componentDidMount() {
		const self = this;
		this.unsubscribe = observeStore();
		function observeStore() {
			let currentState: {
				color: ColorState;
				app: AppState;
			};

			function handleChange() {
				let nextState = store.getState();

				if (currentState && nextState !== currentState) {
					if (
						nextState.app.page === Page.RESULT &&
						currentState.app.page === Page.SURVEY
					) {
						self.animatein();
					} else if (
						nextState.app.page === Page.SURVEY &&
						currentState.app.page === Page.RESULT
					) {
						self.animateOut();
					}
				}

				self.updateColor();

				currentState = nextState;
			}

			return store.subscribe(handleChange);
		}

		const resize = () => {
			this.setState({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};

		resize();
		this.updateColor();
		this.animatein();
		window.addEventListener('resize', resize);
	}

	animatein() {
		TweenMax.killTweensOf(this.el.current);
		TweenMax.to(this.el.current, 1.0, {
			opacity: 1,
			ease: Power4.easeInOut
		});
	}

	updateColor() {
		const selectColors = store.getState().color.selectedColor;

		const colors = { r: 0, g: 0, b: 0 };
		for (let ii = 0; ii < selectColors.length; ii = ii + 1) {
			colors.r += selectColors[ii].r / selectColors.length;
			colors.g += selectColors[ii].g / selectColors.length;
			colors.b += selectColors[ii].b / selectColors.length;
		}

		this.setState({ color: { r: colors.r, g: colors.g, b: colors.b } });
	}

	animateOut() {
		TweenMax.killTweensOf(this.el.current);
		TweenMax.to(this.el.current, 1.0, {
			opacity: 0,
			ease: Power4.easeInOut
		});
	}
	render() {
		return (
			<div
				ref={this.el}
				className="opacity"
				style={{
					width: this.state.width,
					height: this.state.height,
					background: `rgb(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b})`,
					position: 'absolute',
					top: this.state.top,
					left: this.state.left,
					transitionProperty: 'background',
					transitionDuration:'0.6s'
				}}
			></div>
		);
	}
}
