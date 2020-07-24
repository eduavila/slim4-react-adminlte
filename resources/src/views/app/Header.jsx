import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InstitucionalModal from './InstitucionalModal';

import { changeSecretaria } from '../../actions/secretaria';
import { siderbarOpenClose } from '../../actions/sidebar';

import { openModal } from '../../components/modals/actions';
import { Link } from 'react-router-dom';
import { checkEnabledNotification } from '../../push-notification';

class Header extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            alterarSenhaShow: false
        }
    }

    onLogout = (e) =>{
        e.preventDefault();
        
        if(this.props.onLogout){
            this.props.onLogout();
        }
    }

    onTrocaSenha = (e) =>{
        e.preventDefault();

        this.setState({
            ...this.state,
            alterarSenhaShow:true
        });
    }

    onClosedTrocaSenha = () => {
        this.setState({
            ...this.state,
            alterarSenhaShow:false
        });
    }

    onChangeSecretaria = (e,secretaria) => {
        e.preventDefault();

        this.props.changeSecretaria(secretaria);
    }

    onOpenInstitucional = (e) =>{
        e.preventDefault();

        this.props.openModal({
            component: InstitucionalModal,
            institucional: this.props.secretariaSelected.institucional
        });
    }

    onClickSidebar = (e) =>{
        e.preventDefault();

        this.props.siderbarOpenClose();
    }

    onEnabledNotification = (e) =>{
        checkEnabledNotification()
    }

    render(){
        const mensagensNaoLida = this.props.mensagens.filter((item)=>item.lida == 0).length;

        return (
            <header className="main-header">
                {/* Logo */}
                <Link className="logo" to="/">
                    {/* mini logo for sidebar mini 50x50 pixels */}
                     <span className="logo-mini">SG<b>E</b></span>
                    {/* logo for regular state and mobile devices */}
                    <span className="logo-lg"><b>SG</b>E</span>
                </Link>

                {/* Header Navbar: style can be found in header.less */}
                <nav className="navbar navbar-static-top">
                    {/* Sidebar toggle button*/}
                    <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                    </a>
                    
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            { this.props.secretariaSelected && (
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">{`${ this.props.secretariaSelected.id}-${ this.props.secretariaSelected.nome_reduzido }`}<span className="caret" /></a>
                                    <ul className="dropdown-menu" role="menu">
                                        {/* <li><input type="text" placeholder="Search.."/></li>
                                        <li className="divider" /> */}
                                        {
                                            this.props.listSecretarias
                                            .filter((secre)=>secre.id != this.props.secretariaSelected.id )
                                            .map((secre)=>{
                                                return (
                                                <li><a href="#" onClick={(e) => this.onChangeSecretaria(e,secre)} title={ secre.nome }>{secre.id}-{ secre.nome_reduzido }</a></li>
                                                )
                                            })
                                        }
                                    </ul>
                                </li>

                            ) }

                            {
                                this.props.secretariaSelected.institucional && <li><a title="Institucional" href="#" onClick={this.onOpenInstitucional}><i class="fa fa-bookmark-o" aria-hidden="true"></i></a></li>
                            }

                            {/* <ListMessage /> */}
                            <li>
                                <a href="#" data-toggle="control-sidebar" onClick={this.onClickSidebar}>
                                    <i className="fa fa-bell-o" />
                                    
                                   {
                                     mensagensNaoLida 
                                        ? <span className="label label-warning">{ mensagensNaoLida }</span> 
                                        : null
                                   } 
                                </a>
                            </li>

                            {/* User Account: style can be found in dropdown.less */}
                            <li className={`dropdown user user-menu`}>
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">
                                    <img src="./images/user.png" className="user-image" alt="User Image" />
                                    <span className="hidden-xs">{ this.props.usuario && this.props.usuario.nome }</span>
                                </a>
                                <ul className="dropdown-menu">
                                    {/* User image */}
                                    <li className="user-header">
                                        <img src="./images/user.png" className="img-circle" alt="User Image" />
                                        <p>
                                            <small>{ this.props.usuario && this.props.usuario.login}</small>
                                           { this.props.usuario && this.props.usuario.nome }
                                            <small>{ this.props.usuario && this.props.usuario.perfil_descricao}</small>
                                        </p>
                                    </li>
                                    {/* Menu Footer */}
                                    <li className="user-footer">
                                        <div className="pull-left">
                                            <a className="btn btn-primary btn-flat" onClick={this.onEnabledNotification}>Ativar Notificações</a>
                                        </div>
                                        <div className="pull-right">
                                            <a href="#" className="btn btn-primary btn-flat" onClick={this.onLogout}>Sair</a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
                {/* <AlterarSenhaModal show={ this.state.alterarSenhaShow } onClosed={ this.onClosedTrocaSenha }/> */}
            </header>
        )
    }
}

const mapStateToPros = state => ({ 
    listSecretarias: state.secretarias.listSecretarias,
    secretariaSelected: state.secretarias.secretariaSelected ,
    mensagens: state.mensagens.listMensagens
})

const mapDispatchToProps = dispatch => bindActionCreators({ changeSecretaria, openModal, siderbarOpenClose },dispatch)

export default connect(mapStateToPros, mapDispatchToProps)(Header);