import * as React from 'react';
import { Component } from 'react';
import { store, State } from './state/index';
import { updatePage } from './state/App/actions';
import { Page } from './state/App/types';

interface IState {
	color: string;
}

export class Nav extends Component<{}, IState> {
	state = {
		color: '#000000'
	};

	constructor(props = {}) {
		super(props);

		this.onClickSelectResult = this.onClickSelectResult.bind(this);
		this.onClickSelectColors = this.onClickSelectColors.bind(this);
	}

	componentDidMount() {
		store.subscribe(() => {
			setFontColor();
		});

		const setFontColor = () => {
			const selectColors = store.getState().color.selectedColor;

			const colors = { r: 0, g: 0, b: 0 };
			for (let ii = 0; ii < selectColors.length; ii = ii + 1) {
				colors.r += selectColors[ii].r / selectColors.length;
				colors.g += selectColors[ii].g / selectColors.length;
				colors.b += selectColors[ii].b / selectColors.length;
			}

			const gray = (colors.r + colors.b + colors.b) / 3;
			if (gray > 122) {
				this.setState({ color: '#000000' });
			} else {
				this.setState({ color: '#ffffff' });
			}
		};

		setFontColor();
	}

	onClickSelectResult() {
		store.dispatch(updatePage(Page.RESULT));
	}

	onClickSelectColors() {
		store.dispatch(updatePage(Page.SURVEY));
	}

	render() {
		return (
			<div
				style={{
					transitionProperty: 'color',
					transitionDuration: '0.6s',
					position: 'absolute',
					bottom: 40,
					right: 40,
					color: this.state.color
				}}
				className="wf-notosansjapanese"
			>
				<div>好きな色を選んでください。</div>
			</div>
		);
	}
}
