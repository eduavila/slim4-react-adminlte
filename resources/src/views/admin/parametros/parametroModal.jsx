import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import Modal from 'react-bootstrap/lib/Modal';
import { Text, TextArea, Select } from '../../../components/form';

import { Row } from '../../../components/layout';

import parametrosService from '../../../services/parametros';
import LoaderModal from '../../../components/loader/LoaderModal';

class ParametroModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            dados: {id: null, nome: "", descricao: "", valor: "", status: "A", type: ""},
            listType: [],
            listStatus: []
        }
    }

    componentWillMount() { 
        this.loadParametro();
    }
    
    loadParametro(){
        if( this.props.item.paramId ){
            parametrosService
                .get(this.props.item.paramId)
                .then((data) =>{
                    this.setState({
                        ...this.state,
                        dados: data
                    });
            });
        }
        
        this.setState({
            ...this.state,
            listStatus: [{id:'A',nome:'Ativo'},{id:'I',nome:'Inativo'}],
            listType: [{id:'STRING',nome:'STRING'},{id:'ARRAY',nome:'ARRAY'},{id:'INT',nome:'INT'},{id:'FLOAT',nome:'FLOAT'}]
        });
    }

    validate(values) {
        let errors = {};
        if (values.nome === "") {
            errors.nome = "Campo obrigatório!";
        }

        if (values.descricao === "") {
            errors.descricao = "Campo obrigatório!";
        }

        if (values.type == null|| values.type === 0) {
            errors.type = "Campo obrigatório!";
        }

        if (values.valor == null ) {
            errors.valor = "Campo obrigatório!";
        }

        if (values.status == null|| values.length === 0) {
            errors.status = "Campo obrigatório!";
        }

        return errors;
    }

    onSubmit = (values, actions) => {
        parametrosService
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
                                <Modal.Title>Novo/Editar Parâmetro</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row className="group-fields">
                                    <Field name="id" description="ID:" component={Text} cols="1" readOnly/>
                                    <Field name="nome" description="Nome:" component={Text} isRequired cols="12 12 7 7" />
                                    <Field name="status" description="Status:" component={Select} getOptionLabel={defaultLabelNome} options={this.state.listStatus} cols="2" isRequired/>
                                    <Field name="type" description="Tipo:" component={Select} getOptionLabel={defaultLabelNome} options={this.state.listType} cols="2" isRequired/>
                                    <Field name="descricao" description="Descrição:" component={Text} isRequired cols="12" />

                                    <Field name="valor" description="Valor:" component={TextArea} rows={3} isRequired/>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <div className="col-xs-6 row-expand-slide-exit-active pull-right">
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

/*const mapStateToPros = state => ({ listPerfil: perfilService.getAll });*/

export default connect( null, null )(ParametroModal);