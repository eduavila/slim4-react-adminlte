import React, { Component } from 'react';

const customStyle = {
	width: "100%",
    border: "none",
    backgroundColor: "transparent"
}
class ProgressField extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isOpen:false
		}
	}
	renderLabel= () =>{
		return (
			<div className="progress progress" style={{width: "90%",float: "left",margin:"0"}}>
				<div className="progress-bar progress-bar-primary progress-bar" role="progressbar" 
					aria-valuenow={this.props.value ? this.props.value : 0} 
					aria-valuemin={0} 
					aria-valuemax={100} 
					style={{width: `${this.props.value ? this.props.value : 0}%`}}>
					<span>{`${this.props.value ? this.props.value : 0}%`}</span></div>
			</div>
		)
	}

	renderOptions = ()=>{
		return this.props.options.filter(opt => opt != this.props.value).map((option,index) => {
			return (	
				<li key={index}><a style={{textAlign:'center'}} onClick={(e) => this.onChange(e,option)}>{option}</a ></li>
			)
		});
	}

	onChange = (e,value) =>{
		e.preventDefault();
		
		if(this.props.onChange){
			this.props.onChange(value)
		}
	}

	onOpen = (e)=>{
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
				? <div style={{marginBottom:"10px"}}>{ this.renderLabel() } </div>
				: <div class={`dropdown ${this.state.isOpen ?'open': ''}`}>
					<button class="btn btn-default dropdown-toggle" style={customStyle} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" onClick={this.onOpen}>
						{ this.renderLabel() }
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

export default ProgressField
