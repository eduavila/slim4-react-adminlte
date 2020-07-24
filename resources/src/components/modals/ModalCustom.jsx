import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import './ModalCustom.scss';

class ModalCustom extends React.Component {
    constructor(props) {
        super(props);
    }

    onClose = (data) => {
        if (this.props.item.onClose) {
            this.props.item.onClose(data);

            this.props.onClose(this.props.item);
        } else {
            this.props.onClose(this.props.item);
        }
    }

    render() {
        const { zIndex } = this.props;
        const { component, title, size } = this.props.item;
        return (
            <div>
                <Modal bsSize={size || 'lg'} dialogClassName={`${size == 'big' ? 'modal-big-large': ''}`} show={ true } animation={true} onHide={(e) => this.onClose(null) } >
             
                    { 
                        title ?
                            React.isValidElement(title) 
                                ?   <Modal.Header closeButton><Modal.Title componentClass="div">{ title }</Modal.Title></Modal.Header>
                                :   <Modal.Header closeButton>
                                        <Modal.Title>{ title }</Modal.Title>
                                    </Modal.Header>
                                  
                        : null
                    }

                    { React.createElement(component, { ...this.props, onClose: this.onClose}) }
                </Modal>
            </div>
        );
    }
}

export default ModalCustom;
