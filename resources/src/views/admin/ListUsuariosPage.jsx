import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Box, BoxHeader,BoxBody } from '../../components/box';
import { Grid, Row } from '../../components/layout';
import DataTable from '../../components/dataTable';
import { Menu, Item } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import { usuarioRequest } from '../../actions/usuarios';
import { openModal } from '../../components/modals/actions';
import EditUsuarioModal from './EditUsuarioModal';

class ListUsuariosPage extends Component{
    constructor(props){
        super(props);

        this.onNovo = this.onNovo.bind(this);
        this.renderActions = this.renderActions.bind(this);
    }
    

    onShowUsuario = (e,usuario) => {
        e.preventDefault();

        this.props.openModal({
            component: EditUsuarioModal,
            usuarioId: usuario.id,
            /*size: 'big',*/
            onClose: this.loadUsuarios
        });
    }

    componentWillMount() {
        this.loadUsuarios()
    }

    loadUsuarios = () =>{
        this.props.usuarioRequest();
    }
    
    configColumns(){
        return [{
            dataField: 'id',
            text: 'ID',
            sort: true,
            style: {
                width: '80px'
            },
            formatter:(cell, row)=>{
                return (<a href="#" className="link-edit" title={`Editar Registro`} onClick={(e) => this.onShowUsuario(e,row)}>{cell}</a>);
            }
        }, {
            dataField: 'nome',
            text: 'Nome',
            style: {
                minWidth: '200px'
            },
            sort: true
        }, {
            dataField: 'login',
            text: 'Login',
            sort: true
        }, {
            dataField: 'perfil_descricao',
            text: 'Perfil',
            sort: true,
            formatter: (cell, row)=>{
                return (<span><b>{row.perfil_id}</b> - {cell}</span>);
            }
        }, {
            dataField: 'secretaria_descricao',
            text: 'Secretaria',
            sort: true,
            formatter: (cell, row)=>{
                
                return (<span><b>{row.secretaria_id}</b> - {cell}</span>);
            }
        }, {
            dataField: 'acessos',
            text: 'Acessos',
            sort: true,
            formatter: (cell, row)=>{
                return (<span>{cell}</span>);
            }
        }, {
            dataField: 'status',
            text: 'Status',
            sort: true,
            formatter: (cell, row)=>{
                if(cell == 'A'){
                    return (<span class="label label-success label-status"><i class="fa fa-check"></i> Ativo</span>)
                }else{
                    return (<span class="label label-danger label-status"><i class="fa fa-ban"></i> Inativo</span>)
                }
            }
        }
        ];
    }    

    onNovo(e){
        e.preventDefault();
        this.props.openModal({
            component: EditUsuarioModal,
            paramId: null,
            onClose: this.loadUsuarios
        });
    }

    renderActions(){
        /*return ( <Grid className="form-group pull-left no-padding-left" cols="12 6 6 6">
                <a href="#" className="btn btn-sm btn-primary btn-flat pull-left" onClick={this.onNovo} ><i className="fa fa-plus"></i> Novo</a>
            </Grid>  )*/
            return false
    }

    render(){
        return (
            <div className="content">
                <div className="container-full">
                    <section className="content-header">
                        <h1>Usuários</h1>
                        
                        <ol className="breadcrumb">
                            <li><a href="#">Configurações</a></li>
                            <li className="active">Usuários</li>
                        </ol>
                    </section>
                    {/* Main content */}
                    <section className="content">
                        <Box>
                            <BoxBody>
                                <DataTable data={ this.props.listUsuarios.usuarios } 
                                    columns={ this.configColumns() } 
                                    loading={ this.props.listUsuarios.loading }
                                    actions={ this.renderActions } />
                            </BoxBody>  
                        </Box>
                    </section>
                </div>
            </div>
        )
    }
}

const mapStateToPros = state => ({ listUsuarios:state.usuarios.listUsuarios });

const mapDispatchToProps = dispatch => bindActionCreators({ usuarioRequest,openModal },dispatch)

export default connect(mapStateToPros, mapDispatchToProps)(ListUsuariosPage);