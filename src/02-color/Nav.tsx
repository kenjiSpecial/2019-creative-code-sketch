
import * as React from 'react';
import { Component } from 'react';

export class Nav extends Component{
    constructor(props = {}){
        super(props);

        this.onClickSelectResult = this.onClickSelectResult.bind(this)
        this.onClickSelectColors = this.onClickSelectColors.bind(this)
    }

    onClickSelectResult(){
        console.log('onClickSelectResult');
    }

    onClickSelectColors(){
        console.log('onClickSelectColors');
    }

    render(){
        return (
            <div style={{position: "absolute", bottom:40, right: 40}}>
                <div onClick={this.onClickSelectResult}>結果を見る</div>
                <div onClick={this.onClickSelectColors}>色を選ぶ</div>
            </div>
        )
    }
}