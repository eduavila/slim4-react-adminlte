import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import './Loader.scss';

export default props => {
    return (
        <React.Fragment>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body style={{paddingTop:"0px",minHeight: "200px"}}>
                <div className={`ui small segment ${ props.content ? ` content-preloader`:``}` }>
                    <div className="ui active inverted dimmer">
                        <div className={`ui loader ${ !props.notViewDescription ? 'text':'' } ${ props.size }`}>
                            { !props.notViewDescription ? ( props.description || 'Carregando..') : null }
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </React.Fragment>
    )
}
