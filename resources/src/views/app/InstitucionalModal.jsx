import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import PerfectScrollbar from '@opuscapita/react-perfect-scrollbar';


export default props => (
    <>
        <Modal.Header closeButton>
            <Modal.Title componentClass="div">
                <h4>
                    Institucional
                </h4>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: "0px", height: "601px"}}>
            <PerfectScrollbar>
                <div dangerouslySetInnerHTML={{ __html: props.item.institucional }}></div>
            </PerfectScrollbar>
        </Modal.Body>
    </>
)