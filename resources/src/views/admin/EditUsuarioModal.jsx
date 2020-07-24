import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik, Form, Field } from 'formik';
import { Text, Select, Password, Checked } from '../../components/form';
import Modal from 'react-bootstrap/lib/Modal';

import { Row } from '../../components/layout';

import { openModal } from '../../components/modals/actions';
import { getUsuario, createUsuario, saveUsuario } from '../../actions/usuarios';

import LoaderModal from '../../components/loader/LoaderModal';
import perfilService from '../../services/perfil';
import secretariaService from '../../services/secretarias';
import AlterarSenha from './AlterarSenha';

const defaultLabelTipos = (option)=> `${option.titulo}`;
class EditUsuarioModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            usuarioEdit: { id: null, login: "", status: "A", perfil_id: "", nome: "", matricula: "", email: "", secretaria_id: "", gerencia_agenda: false, tipo_demanda: []},
            usuarioLoading: true,
            listPerfil: [],
            listSecretaria: [],
            listStatus: [],
            tiposAcao: []
        }
    }

    componentWillMount() { 
        this.loadUsuario();
    }
    
    onAlteraSenha = (e) => {
        e.preventDefault();
        this.props.openModal({
            component: AlterarSenha,
            usuarioId: this.state.usuarioEdit.id,
            size: 'small'
        });
    }

    loadUsuario(){
        this.setState({
            ...this.state,
            usuarioLoading: true
        });

        if( this.props.item.usuarioId ){
            this.props.getUsuario(this.props.item.usuarioId)
                .then((data) => {
                    data.secretarias = data.secretarias.map( value => value.id);
                    if(data.tipo_demanda_ids){
                        data.tipo_demanda_ids = data.tipo_demanda_ids.split(',').map((id) => parseInt(id) );
                    }else{
                        data.tipo_demanda_ids = [];
                    }
                
                    this.setState({
                        ...this.state,
                        usuarioLoading: false,
                        usuarioEdit: data
                });
            });
        }

        perfilService.getAll().then((data) =>{
            this.setState({
                ...this.state,
                listPerfil: data
            })
        });

        secretariaService.getAll().then((data) =>{
            this.setState({
                ...this.state,
                listSecretaria: data
            })
        });

        this.setState({
            ...this.state,
            listStatus: [{id:'A',nome:'Ativo'},{id:'I',nome:'Inativo'}],
            usuarioLoading: false
        });
    }

    validate(values) {
        let errors = {};
        if (values.nome === "") {
            errors.nome = "Campo obrigatório!";
        }

        if (values.login === "") {
            errors.login = "Campo obrigatório!";
        }

        if (values.perfil_id == null|| values.length === 0) {
            errors.perfil_id = "Campo obrigatório!";
        }

        if (values.secretaria_id == null|| values.length === 0) {
            errors.secretaria_id = "Campo obrigatório!";
        }

        if (values.status == null|| values.length === 0) {
            errors.status = "Campo obrigatório!";
        }

        return errors;
    }

    onSubmit = (values, actions) => {
        this.props
            .saveUsuario(values)
            .then(()=>{
                actions.setSubmitting(false);
                this.props.onClose(null);
            })
            .catch(()=>{
                actions.setSubmitting(false);
            });
    }

    render() {
        const { usuarioLoading, usuarioEdit } = this.state;
        const defaultLabel = (option)=> (<span className="label-options">{option.descricao}</span>);
        const defaultLabelNome = (option)=> (<span className="label-options">{option.nome}</span>);

        return (
            usuarioLoading
            ? <LoaderModal />  
            :(
                <Formik
                    enableReinitialize
                    initialValues={usuarioEdit}
                    validate={this.validate}
                    onSubmit={this.onSubmit}>

                    {({ touched, errors, isSubmitting }) =>(
                        <Form>
                            <Modal.Header closeButton>
                                <Modal.Title>Novo/Editar Usuário</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row className="group-fields">
                                    <Field name="id" description="ID:" component={Text} cols="1" readOnly/>
                                    <Field name="login" description="Login:" component={Text} isRequired cols="6 6 4 4" />
                                    <Field name="perfil_id" description="Perfil:" component={Select} getOptionLabel={defaultLabel} options={this.state.listPerfil} cols="4" isRequired/>
                                    <Field name="matricula" description="Matricula:" component={Text} cols="6 6 2 2" />
                                    <Field name="secretaria_id" description="Secretaria:" component={Select} getOptionLabel={defaultLabelNome} options={this.state.listSecretaria} cols="6" isRequired/>
                                    <Field name="gerencia_agenda" description="Gerenciar Agenda:" component={Checked} cols="4 2 2 2" />
                                    <Field name="nome" description="Nome:" component={Text} isRequired cols="12 12 6 6" />
                                    <Field name="email" description="E-mail:" component={Text} cols="12 12 6 6" />
                                    <Field name="status" description="Status:" component={Select} getOptionLabel={defaultLabelNome} options={this.state.listStatus} cols="2" isRequired />
                                    <Field name="tipo_demanda_ids" description="Tipo demandas:" component={Select} getOptionLabel={defaultLabelTipos} isMulti options={this.state.tiposAcao} cols="6" isRequired />
                                    
                                    { !usuarioEdit.id && ( <Field name="senha" description="Senha:" component={Password} cols="12 12 4 4" isRequired autoComplete="off" /> ) }
                                    { usuarioEdit.id && 
                                        ( <Field name="secretarias" description="Secretarias de Acessos:" component={Select} options={this.state.listSecretaria} isMulti cols="12" /> ) } 
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <div className="col-xs-6 row-expand-slide-exit-active pull-right ">
                                    <button type="button" className="btn btn-default btn-xs" onClick={(e) => this.props.onClose(null) }
                                        disabled={ isSubmitting }><i class="fa fa-ban"></i> Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary btn-xs" 
                                        disabled={ isSubmitting }><i class="fa fa-save"></i> { isSubmitting ? "Enviado..." : "Salvar"}
                                    </button>
                                </div>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            )
        );
    }
}

/*const mapStateToPros = state => ({ listPerfil: perfilService.getAll });*/
const mapDispatchToProps = dispatch => bindActionCreators({ createUsuario, getUsuario, saveUsuario, openModal },dispatch);

export default connect(null,mapDispatchToProps)(EditUsuarioModal);