import React, { Component } from 'react';

const customStyle = {
	width: "100%",
    border: "none",
    backgroundColor: "transparent"
}
class Prioridade extends Component {
	constructor(props) {
		super(props)

		this.renderLabel = this.renderLabel.bind(this);
		this.renderOptions = this.renderOptions.bind(this);
		this.onOpen = this.onOpen.bind(this);
		this.onChange = this.onChange.bind(this);

		this.state = {
			isOpen:false
		}
	}
	renderLabel(value){
		if(!value) return null;
		
		return (<React.Fragment>
			<span style={{ backgroundColor: value['cor'], width: "1.5rem", height: "1.5rem", display: "inline-block", marginLeft: "10px" }}></span>
			<strong>{value['descricao']}</strong></React.Fragment>
		)
	}

	renderOptions(){
		return this.props.options.filter(opt => opt['id'] != this.props.value).map((option,index) => {
			return (	
				<li key={index}>
					<a onClick={(e) => this.onChange(e,option)}>
						<span style={{ backgroundColor: option['cor'], width: "1.5rem", height: "1.5rem", display: "inline-block", marginLeft: "10px" }}></span><strong>{option['descricao']}</strong>
					</a>
				</li>
			)
		});
	}

	onChange(e,option){
		e.preventDefault();

		if(this.props.onChange){
			this.props.onChange(option['id'])
		}
	}

	onOpen(e){
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
				? <div style={{marginBottom:"10px"}}>{ value ? this.renderLabel(value) : null }</div>
				: <div class={`dropdown ${this.state.isOpen ?'open': ''}`}>
					<button class="btn btn-default dropdown-toggle" style={customStyle} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" onClick={this.onOpen}>
						{ value ? this.renderLabel(value) : null }
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

export default Prioridade
