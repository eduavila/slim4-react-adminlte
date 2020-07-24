import React, { Component } from 'react';

const customStyle = {
	width: "100%",
    border: "none",
    backgroundColor: "transparent"
};

class Situacao extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isOpen:false
		}
	}

	renderLabel = (value) =>{
		if(!value) return null;
		
		return (
			<span className="label label-status" style={{ backgroundColor: value['cor'] }}>{value['descricao']}</span>
		)
	}

	renderOptions = () => {
		return this.props.options.filter(opt => opt['id'] != this.props.value['id']).map((option,index) => {
			return (	
				<li key={index}>
					<a style={{textAlign:'center'}} onClick={(e) => this.onChange(e,option['id'])}>
						<span className="label label-status" style={{ backgroundColor: option['cor'] }}>{option['descricao']}</span>
					</a >
				</li>
			)
		});
	}

	onChange = (e,option)=>{
		e.preventDefault();
		if(this.props.onChange){
			this.props.onChange(option);
		}
	}

	onOpen = (e) =>{
		e.preventDefault();

		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	render() {
		let value = null;
		if(this.props.options){
			value = this.props.options.find(opt => opt.id === this.props.value);
		}

		return (<div>
			<label className="control-label">
				{this.props.description}
			</label>

			{
				this.props.readOnly 
				? <div style={{marginBottom:"10px"}}>{this.renderLabel(value)}</div>
				: <div class={`dropdown ${this.state.isOpen ?'open': ''}`}>
					<button class="btn btn-default dropdown-toggle" style={customStyle} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" onClick={this.onOpen}>
						{ this.renderLabel(value) }
						<span class="caret" style={{marginLeft:"10px"}}></span>
					</button>
					<ul class="dropdown-menu">
						{ this.state.isOpen ? this.renderOptions() : null}
					</ul>
				</div>
			}
		</div>
		);
	}
}

export default Situacao
