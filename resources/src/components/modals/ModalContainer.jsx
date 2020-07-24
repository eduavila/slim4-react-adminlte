import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ModalCustom from './ModalCustom'

import { closeModal } from './actions';

class ModalContainer extends Component {
    constructor(props){
        super(props)

        this.onClose = this.onClose.bind(this)
    }

    onClose(item){
        this.props.closeModal(item)
    }

    render() {
        const modals = this.props.modals.map((item,i) => {
            return (<ModalCustom item={item} key={i} zIndex={i} onClose={ this.onClose }></ModalCustom>)
        })

        return (
            <div className="modals">
                { modals }
            </div>
        );
    }

}

const mapDispatchToProps = dispatch => bindActionCreators({ closeModal },dispatch)
const mapStateToProps = state =>({ modals: state.modals.modals})

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
