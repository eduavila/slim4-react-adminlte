import React, {Component} from 'react';
import { Link } from "react-router-dom";

export default class NavLeft extends Component {

    componentDidMount(){
        // 
        // Aplica treelist jquery.
        //
        $(document).ready(() => {
            const trees = $('[data-widget="tree"]');
            trees.tree();
        });
    }

    render(){
        return (
            <aside className="main-sidebar">
                {/* sidebar: style can be found in sidebar.less */}
                <section className="sidebar">

                {/* search form */}
                {/* <form action="#" method="get" className="sidebar-form">
                    <div className="input">
                        <input type="text" name="q" className="form-control" placeholder="Search..." />
                    </div>
                </form> */}
            
                <ul className="sidebar-menu" data-widget="tree">
                    {/* MENU USUARIO */}
                    <li><Link to="/me/painel"><i class="fa fa-tachometer"></i><span>Painel</span></Link></li>
                    <li><Link to="/me/tarefas"><i class="fa fa-tags"></i> <span>Minhas Tarefas</span></Link></li>
                    <li><Link to="/me/acoes"><i class="fa fa-bullhorn"></i> <span>Minhas Ações</span></Link></li>
                    <li><Link to="/me/agenda"><i class="fa fa-calendar"></i> <span>Agenda</span></Link></li>

                    {/* MENU DO GESTOR */}
                    { this.props.usuario.perfil_id != 3 
                        ? <React.Fragment>
                            <li class="header"></li>
                            <li><Link to="/painel-geral"><i class="fa fa-tachometer"></i> <span>Dashboard</span></Link></li>
                            <li><Link to="/objetivos"><i class="fa fa-rocket"></i> <span>Objetivos</span></Link></li>
                            <li><Link to="/perspectivas"><i class="fa fa-globe"></i> <span>Perspectivas</span></Link></li>
                        </React.Fragment>
                        : null 
                    }

                    {/* MENU ADMINISTRADOR */}
                    { 
                        this.props.usuario.perfil_id == 1 
                        ? <React.Fragment> 
                            <li class="header"></li>
                                <li className="treeview">
                                    <a href="#">
                                        <i className="fa fa-wrench"/> <span>Configurações</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><Link to="/admin/secretarias"><i className="fa fa-th" /> Secretarias</Link></li>
                                        <li><Link to="/admin/usuarios"><i className="fa fa-users" />Usuários</Link></li>
                                        <li><Link to="/admin/parametros"><i className="fa fa-cogs" /> Parametros</Link></li>
                                        <li><Link to="/admin/perfils"><i className="fa fa-exchange" /> Perfil</Link></li>
                                        <li><Link to="/admin/sessoes"><i className="fa fa-info-circle" /> Sessões</Link></li>
                                    </ul>
                                </li>
                        </React.Fragment>
                        : null 
                    }
                </ul>
                </section>
            </aside>
        )
    }
}