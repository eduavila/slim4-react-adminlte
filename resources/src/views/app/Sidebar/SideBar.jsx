import React, { useState, Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PerfectScrollbar from '@opuscapita/react-perfect-scrollbar';
import DetailMessage from './DetailMessage';

import './SideBar.scss';
import Loader from '../../../components/loader/Loader';

import { loadMensagens, setLidaMensagens } from '../../../actions/mensagens';
import { siderbarOpenClose } from '../../../actions/sidebar';

class SideBar extends Component{
    constructor(props){
        super(props);

        this.state = {
            selectedMessage:null
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isOpen != prevProps.isOpen) {

            if (!prevProps.isOpen) {
                this.setState({
                    ...this.state,   
                    selectedMessage: null
                })
            }
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

        /**
     * Set the wrapper ref
     */
    setWrapperRef = (node) =>{
        this.wrapperRef = node;
    }
  
    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside = (event) => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.dispatch(siderbarOpenClose());
        }
    }

    openDetail = (e, selectedMessage) => {
        e.preventDefault();

        //Seta cmensagem como lida.
        if(!selectedMessage.lida){
            this.props.dispatch(setLidaMensagens(selectedMessage.id));
        }

        this.setState({
            ...this.state,
            selectedMessage
        });
    }

    closeDetail = (e) => {
        e.preventDefault();

        this.setState({
            ...this.state,
            selectedMessage: null
        })
    }

    buscarTodas = (e) =>{
        e.preventDefault();

        this.props.dispatch(loadMensagens(0));
    }

    closeSiderbar = (e) => {
        e.preventDefault();

        this.props.dispatch(siderbarOpenClose());
    }
    render() {
        const { selectedMessage } = this.state;
        const { siderBarOpen, mensagens } = this.props;
        return  siderBarOpen 
                ? (
                    <aside className="control-sidebar control-sidebar-light control-sidebar-open custom-sidebar" ref={this.setWrapperRef}>
                        <PerfectScrollbar>
                            <div className="header-sidebar">
                                <button type="button" class="close" aria-label="Close" onClick={this.closeSiderbar}>
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
            
                            {
                                this.state.selectedMessage
                                    ? <DetailMessage message={this.state.selectedMessage} onClose={this.closeDetail} />
                                    : null
                            }
            
                            <div className="body-sidebar">
                                {
                                    mensagens.map((message, index) => {
                                        return(
                                            <div key={index}
                                                id={`message_${index}`}
                                                className={`post ${selectedMessage && message.id == selectedMessage.id ? 'active' : ''} ${!message.lida ? 'no-read' : ''}`} 
                                                onClick={(e) => this.openDetail(e, message)}>
            
                                                <div className="user-block">
                                                    <img className="img-circle img-bordered-sm" src="./images/user.png" alt="user image" />
                                                    <span className="username" title={`${message.usuario_de}-${message.usuario_de_descri}`}>
                                                        {message.usuario_de_descri}
                                                        {/* <a href="#" className="pull-right btn-box-tool"><i className="fa fa-times" /></a> */}
                                                    </span>
                                                    <span className="description" title={moment(message.created_at).format('DD/MM/YYYY H:mm')}>
                                                        { moment(message.created_at).fromNow() }
                                                    </span>
                                                </div>
                                                {/* /.user-block */}
                                                <p>
                                                    {message.titulo}
                                                </p>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            {
                                !this.props.loadAll
                                ? ( 
                                    <div className="loading-data">
                                        {
                                            this.props.loading
                                                ?  <Loader></Loader> 
                                                : <a href="#" onClick={this.buscarTodas}>Listar todas</a>
                                        }
                                    </div>
                                )
                                : null
                            }
                        
                        </PerfectScrollbar>
                    </aside>
                )
            :null
    }
}

const mapStateToPros = state =>({
    mensagens: state.mensagens.listMensagens,
    loading: state.mensagens.loading,
    loadAll: state.mensagens.loadAll,
    siderBarOpen: state.sidebar.siderBarOpen
});

export default connect(mapStateToPros,null)(SideBar);
