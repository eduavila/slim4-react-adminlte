import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

class BoxConfirmInput extends Component{
    constructor(props){
        super(props)

        this.state = {
            result: ''
        };
    }

    onChange = (e)=>{
        this.setState({
            result: e.target.value
        });
    }

    render(){
        return (
            <Modal bsSize='lg' show={ this.props.show } animation={true} onHide={(e) => this.props.onClose({ isCancel:false }) }>
                <Modal.Header closeButton>
                     <Modal.Title>{this.props.message}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" autoComplete="off" className="form-control" value={this.state.result} onChange={this.onChange}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-secondary" onClick={() => this.props.onClose({ isCancel:true })}>
                        Cancelar
                    </Button>
                    <Button className="btn btn-primary" onClick={() => this.props.onConfirm(this.state.result)} disabled={this.state.result.length < 5}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>  
        );
    }
}

BoxConfirmInput.propTypes = {
  show: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string,
};

export default BoxConfirmInput;