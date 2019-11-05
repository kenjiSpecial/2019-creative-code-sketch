import * as React from 'react';
import { Component } from 'react';
import { Nav } from './Nav';
import { ColorPick } from './ColorPick';
import { ColorResult } from './ColorResult';

export class Colors extends Component<{}, {}> {
	render() {
		return (
			<div className={'fullSize'}>
				<ColorResult/>
				<ColorPick />
				<Nav/>
			</div>
		);
	}
}
