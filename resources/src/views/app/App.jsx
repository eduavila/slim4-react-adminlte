import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Redirect } from 'react-router-dom';
import loadable from 'react-loadable';
import history from '../../history';

import { Grid } from '../../components/layout';
import CacheBuster from '../../components/CacheBuster';
import SideBar from './Sidebar/SideBar';

import Loader from '../../components/loader/Loader';
import ModalContainer from '../../components/modals/ModalContainer';
import Header from './Header';
import NavLeft from './NavLeft';
import Footer from './Footer';

import { logout } from '../../actions/auth';
import { requestSecretariaAcesso } from '../../actions/secretaria';
import { loadMensagens } from '../../actions/mensagens';
import { initializeFirebase,checkEnabledNotification } from '../../push-notification';

// loading view
const LoadingComponent = (props) => {
    if (props.error) {
        console.error(props.error);

        return <Grid className="error-loading">
                <h2>Ops! Ocorreu um erro ao carregar página.</h2> 
                <button className="btn btn-default" onClick={()=>{ window.location.reload(true);}}>Tentar novamente</button>
            </Grid>;

    } else if (props.pastDelay) {
        return <Loader></Loader>; 
    } else {
        return null;
    }
};

const AsyncPainelPage = loadable( {
    loader: () => import( '../painel/PainelPage' ),
    loading: LoadingComponent
} );

const AsyncAdminUsuarios = loadable( {
    loader: () => import( '../admin/ListUsuariosPage' ),
    loading: LoadingComponent
} );

const AsyncAdminParametros = loadable( {
    loader: () => import( '../admin/parametros/parametrosPage' ),
    loading: LoadingComponent
} );

const AsyncAdminPerfils = loadable( {
    loader: () => import( '../admin/perfils/perfilsPage' ),
    loading: LoadingComponent
} );

const AsyncAdminSecretarias = loadable( {
    loader: () => import( '../admin/secretarias/secretariasPage' ),
    loading: LoadingComponent
} );

class App extends Component {
    constructor(props){
        super(props);
    }

    componentWillMount() {
        const { usuario } = this.props;
        
        if (!usuario) {
            history.push('/login');
        }else{
            this.props.requestSecretariaAcesso();

            // Inicializar firebase;
            initializeFirebase();

            checkEnabledNotification(true);

            // Busca menssagens do usuario
            //Faz primeira chamda
            this.props.loadMensagens(20);

            // Chama novamente a cadas 1min para verifica ultimas notificas
            setInterval(()=>{
                this.props.loadMensagens(20);
            },60000) // 1min
        }
    }

    //Faz logout do sistema
    onLogout = () => {
        this.props.logout();
    }
    
    render() {
        const { usuario } = this.props;
        
        if(usuario && this.props.secretariaSelected){
            
            {/* Verifica versão do bundle arquivo meta.json  */}
            return (<CacheBuster>
                {({ loading, isLatestVersion, refreshCacheAndReload }) => {
                    if (loading) return null;
                    if (!loading && !isLatestVersion) {
                        // You can decide how and when you want to force reload

                        alert("Nova versão esta disponível!")
                        refreshCacheAndReload();
                    }

                    return (
                        <div className="wrapper">
                            {/* Cabecalho */}
                            <Header usuario={ usuario } onLogout={this.onLogout}></Header>
            
                            {/* Navegacao lateral*/}
                            <NavLeft usuario={ usuario }></NavLeft>
                        
                            {/* Content */}
                            <div className="content-wrapper">
                                {/* Rotas */}
                                
                                {/* Caso for Administrador ou Gestor redirecionar para painel geral. */}
                                <Route exact path={`${this.props.match.path}`} render={(props) => {
                                    console.log('Redirecionado página principal.');

                                    return (<Redirect to="/me/painel" />)
                                }} />

                                {/* Admin */}
                                {
                                    ( usuario && usuario.perfil_id == 1) 
                                        ?<React.Fragment>
                                            <Route exact path={`/admin/usuarios`} render={(props) => <AsyncAdminUsuarios/>} />
                                            <Route exact path={`/admin/parametros`} render={(props) => <AsyncAdminParametros/>} />
                                            <Route exact path={`/admin/perfils`} render={(props) => <AsyncAdminPerfils/>} />
                                            <Route exact path={`/admin/secretarias`} render={(props) => <AsyncAdminSecretarias/>} />
                                        </React.Fragment>
                                        : null
                                }

                                <Route exact path={`/painel`} render={(props) => <AsyncPainelPage/>} />
                                {/* Não encontrado rota
                                <Redirect from='*' to='/' /> */}
                            </div>
                            
                            {/* Rodapé */}
                            <Footer />

                            {/* Painel de notificacao */}
                            <SideBar/>
                            
                            <div className="control-sidebar-bg" />
                                
                            {/* Modals */}
                            <ModalContainer />
                        </div>
                    );
                }}
            </CacheBuster>);

        }else{
            return (<div className="preloader"></div>)
        }        
    }
}

const mapStateToPros = state => ({ usuario: state.auth.usuario, secretariaSelected: state.secretarias.secretariaSelected })
const mapDispatchToProps = dispatch => bindActionCreators({ logout, requestSecretariaAcesso, loadMensagens },dispatch)

export default connect(mapStateToPros, mapDispatchToProps)(App);