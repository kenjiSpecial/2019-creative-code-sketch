import * as React from 'react';
import { Component } from 'react';
import { Nav } from './Nav';
import { ColorPick } from './ColorPick';

export class Colors extends Component<{}, {}> {
	render() {
		return (
			<div>
                <Nav />
                <ColorPick />
			</div>
		);
	}
}
