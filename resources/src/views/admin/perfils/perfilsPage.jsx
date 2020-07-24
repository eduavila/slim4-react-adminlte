import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Box, BoxHeader,BoxBody } from '../../../components/box';
import { Grid, Row } from '../../../components/layout';
import DataTable from '../../../components/dataTable';
import 'react-contexify/dist/ReactContexify.min.css';

import perfilService from '../../../services/perfil';
import { openModal } from '../../../components/modals/actions';
import PerfilModal from './perfilModal';

  
class PerfilsPage extends Component{
    constructor(props){
        super(props);

        this.onNovo = this.onNovo.bind(this);
        this.renderActions = this.renderActions.bind(this)

        this.state = {
            loading: false,
            perfils: []
        }
    }
    
    onShowPerfil = (e,row) => {
        e.preventDefault();

        this.props.openModal({
            component: PerfilModal,
            perfilId: row.id,
            /*size: 'big',*/
            onClose: this.loadPerfils
        });
    }
    
    componentWillMount() {
        this.loadPerfils()
    }

    loadPerfils = () =>{
        this.setState({
            ...this.state,
            loading: true
        })

        perfilService
            .getAll()
            .then((data) =>{
                this.setState({
                    ...this.state,
                    perfils: data,
                    loading: false
                })
            })
            .catch((err)=>{        
                this.setState({
                    perfils: [],
                    loading:false   
                });
            });
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
                return (<a href="#" className="link-edit" title={`Editar Registro`} onClick={(e) => this.onShowPerfil(e,row)}>{cell}</a>);
            }
        }, {
            dataField: 'descricao',
            text: 'Descricao',
            sort: true
        },{
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
            component: PerfilModal,
            paramId: null,
            onClose: this.loadPerfils
        });
    }

    renderActions(){
        return ( <Grid className="form-group pull-left no-padding-left" cols="12 6 6 6">
                <a href="#" className="btn btn-sm btn-primary btn-flat pull-left" onClick={this.onNovo} ><i className="fa fa-plus"></i> Novo</a>
            </Grid>  )
    }

    render(){
        return (
            <div className="content">
                <div className="container-full">
                    <section className="content-header">
                        <h1>Perfils</h1>
                        
                        <ol className="breadcrumb">
                            <li><a href="#">Configurações</a></li>
                            <li className="active">Perfil</li>
                        </ol>
                    </section>
                    {/* Main content */}
                    <section className="content">
                        <Box>
                            <BoxBody>
                                <DataTable data={ this.state.perfils } 
                                    columns={ this.configColumns() } 
                                    loading={ this.state.loading }
                                    actions={ this.renderActions } />
                            </BoxBody>  
                        </Box>
                    </section>
                </div>
            </div>
        )
    }
}

/*const mapStateToPros = state => ({ listParametros:state.parametros.listParametros });*/

const mapDispatchToProps = dispatch => bindActionCreators({ openModal },dispatch)

export default connect(null, mapDispatchToProps)(PerfilsPage);