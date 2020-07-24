import React,{ Component } from 'react'

class FormAlert extends Component{
    constructor(props) {
        super(props)
        this.onClose = this.onClose.bind(this,false)

        this.state = {
            visibled: true
        }
    }

    onClose() {
        this.setState({ visibled:false })
    }
    
    render(){
        const msgs = [];
        const message = this.props.message;
        const msgArray = message instanceof Array
        const classAlert = `alert alert-${this.props.type} ${ this.state.visibled ? 'alert-shown' : 'alert-hidden'}`;

        if(msgArray){
            message.forEach((msg,index) =>{
                msgs.push(
                    <li key={index}>{msg}</li>
                );
            })
        }  
        if(message && msgArray) {
            if(msgArray.length > 0){
                setTimeout(()=>{
                    this.onClose();
                },this.props.time)
                
                return (<div className={classAlert} role='alert'>
                        <button type="button" className="close" aria-label="Close" onClick={ this.onClose }>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <ul dangerouslySetInnerHTML={{__html: msgs}}></ul>
                        </div>)
            }else{
                return null;
            }
        }else if(message) {
            setTimeout(()=>{
                this.onClose();
            },this.props.time)

            return (<div className={classAlert} role='alert'>
                <button type="button" className="close" aria-label="Close" onClick={ this.onClose }>
                    <span aria-hidden="true">&times;</span>
                </button>
                <span dangerouslySetInnerHTML={{__html: message}}></span>
            </div>)
        } else {
            return null;
        }
    }
}



FormAlert.defaultProps = {
    type: 'danger',
    time: 6000
};

export default FormAlert
