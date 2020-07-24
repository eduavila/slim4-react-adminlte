import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik, Form, Field } from 'formik';
import Modal from 'react-bootstrap/lib/Modal';
import { Text, Select } from '../../../components/form';

import { Row } from '../../../components/layout';
import perfilService from '../../../services/perfil';

class PerfilModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            dados: {id: null, descricao: "", status: "A"},
            listStatus: []
        }
    }

    componentWillMount() { 
        this.loadPerfil();
    }
    
    loadPerfil(){
        if( this.props.item.perfilId ){
            perfilService
                .get(this.props.item.perfilId)
                .then((data) =>{
                    this.setState({
                        ...this.state,
                        dados: data
                    });
            });
        }
        
        this.setState({
            ...this.state,
            listStatus: [{id:'A',nome:'Ativo'},{id:'I',nome:'Inativo'}]
        });
    }

    validate(values) {
        let errors = {};

        if (values.descricao === "") {
            errors.descricao = "Campo obrigatório!";
        }

        if (values.status == null|| values.length === 0) {
            errors.status = "Campo obrigatório!";
        }

        return errors;
    }

    onSubmit = (values, actions) => {
        perfilService
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
                                <Modal.Title>Novo/Editar Perfil</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row className="group-fields">
                                    <Field name="id" description="ID:" component={Text} cols="1" readOnly/>
                                    <Field name="descricao" description="Descrição:" component={Text} isRequired cols="9" />
                                    <Field name="status" description="Status:" component={Select} getOptionLabel={defaultLabelNome} options={this.state.listStatus} cols="2" isRequired/>
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

/*const mapStateToPros = state => ({ listPerfil: perfilService.getAll });
const mapDispatchToProps = dispatch => bindActionCreators({  },dispatch);*/

export default connect( null, null )(PerfilModal);