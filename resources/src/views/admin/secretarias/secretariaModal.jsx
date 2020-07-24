import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import Modal from 'react-bootstrap/lib/Modal';

import { Text, Select, TextArea } from '../../../components/form';

import { Row } from '../../../components/layout';
import secretariasService from '../../../services/secretarias';
import usuariosService from '../../../services/usuarios';

class SecretariaModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            dados: {id: null, sigla: "", nome: "", nome_reduzido: "", responsavel: "", status: "A"},
            listUsuarios:[],
            listStatus: []
        }
    }

    componentWillMount() { 
        this.loadSecretaria();
    }
    
    loadSecretaria(){
        if( this.props.item.secId ){
            secretariasService
                .get(this.props.item.secId)
                .then((data) =>{
                    this.setState({
                        ...this.state,
                        dados: data
                    });
            });
        }
        
        usuariosService.getAll().then((data) =>{
            this.setState({
                ...this.state,
                listUsuarios: data
            })
        });

        this.setState({
            ...this.state,
            listStatus: [{id:'A',nome:'Ativo'},{id:'I',nome:'Inativo'}]
        });
    }

    validate(values) {
        let errors = {};

        if (values.sigla === "") {
            errors.sigla = "Campo obrigatório!";
        }

        if (values.nome === "") {
            errors.nome = "Campo obrigatório!";
        }

        if (values.status == null|| values.length === 0) {
            errors.status = "Campo obrigatório!";
        }

        return errors;
    }

    onSubmit = (values, actions) => {
        secretariasService
            .createOrUpdate(values)
            .then(()=>{
                actions.setSubmitting(false);
                this.props.onClose(null);
            })
            .catch(()=>{
                actions.setSubmitting(false);
            });
    }

    render() {
        const { dados } = this.state;
        const defaultLabelNome = (option)=> (<span className="label-options">{option.nome}</span>);

        return (<Formik
                    enableReinitialize
                    initialValues={dados}
                    validate={this.validate}
                    onSubmit={this.onSubmit}>

                    {({ touched, errors, isSubmitting }) =>(
                        <Form>
                            <Modal.Header closeButton>
                                <Modal.Title>Novo/Editar Secretaria</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row className="group-fields">
                                    <Field name="id" description="ID:" component={Text} cols="1" readOnly/>
                                    <Field name="sigla" description="Sigla:" component={Text} isRequired cols="2" />
                                    <Field name="nome" description="Nome:" component={Text} isRequired cols="7" />
                                    <Field name="status" description="Status:" component={Select} getOptionLabel={defaultLabelNome} options={this.state.listStatus} cols="2" isRequired/>
                                    
                                    <Field name="nome" description="Nome Reduzido:" component={Text} isRequired cols="6" />
                                    <Field name="responsavel" description="Responsável:" component={Select} getOptionLabel={defaultLabelNome} options={this.state.listUsuarios} cols="6" />
                                    <Field name="institucional" description="Institucional:" component={TextArea} isRequired cols="12" />
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <div className="col-xs-6 row-expand-slide-exit-activepull-right pull-right">
                                    <button type="button" className="btn btn-default btn-xs" onClick={(e) => this.props.onClose(null) }
                                        disabled={ isSubmitting }><i class="fa fa-arrow-left"></i> Cancelar
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
    }
}

export default SecretariaModal;