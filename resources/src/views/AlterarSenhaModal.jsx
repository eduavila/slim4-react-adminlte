import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import Modal from 'react-bootstrap/lib/Modal';
import FormAlert from '../components/form/FormAlert';
import { addError, addSuccess } from '../actions/toasts';

import { alterarSenhaRequest } from '../actions/usuarios';

class AlterarSenhaModal extends Component {
    constructor(props){
        super(props)

        this.onSubmit = this.onSubmit.bind(this);
        this.onClosed = this.onClosed.bind(this);
    }

    validate(values) {
        let errors = {};
        if (values.senha === "") {
            errors.senha = "Campo obrigatório";
        }

        if (values.confirmarSenha === "") {
            errors.confirmarSenha = "Campo obrigatório";
        }

        if (values.confirmarSenha != values.senha){
            errors.confirmarSenha = "Senha estão divergentes!";
        }

        return errors;
    }

    onSubmit(values, actions) {
        this.props.dispatch(alterarSenhaRequest(values.senha,values.confirmarSenha))
        .then(() =>{
            this.props.onClosed()
        }).catch(()=>console.log("Erro ao alterar senha."));
    }

    onClosed(){
        if(this.props.onClosed){
            this.props.onClosed();
        }
    }

    render() {
        return (
            <Modal show={this.props.show} animation={true} onHide={(e) => this.onClosed() }>
                <Formik
                    initialValues={{ senha: "", confirmarSenha: "" }}
                    validate={this.validate}
                    onSubmit={this.onSubmit}>
                            
                        {({ touched, errors, isSubmitting }) =>(

                        <Form>
                            <Modal.Header closeButton>
                                <Modal.Title>Alterar Senha</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                { this.props.alterarSenhaErrors && 
                                    (<FormAlert key='errors_login' message={ this.props.alterarSenhaErrors.msg } type='danger' />) }

                                    {/* Senha */}
                                    <div className={`form-group has-feedback ${
                                                touched.senha && errors.senha ? "has-error" : ""
                                                }`}>
                                        <label>Senha:</label>
                                        <Field
                                            type="password"
                                            name="senha"
                                            placeholder="Nova senha"
                                            className={`form-control ${
                                                touched.senha && errors.senha ? "is-invalid" : ""
                                                }`}
                                        />
                                        
                                        <span className="glyphicon glyphicon-lock form-control-feedback" />
                                        <ErrorMessage
                                            component="span"
                                            name="senha"
                                            className="help-block"
                                        />
                                    </div>
                                    {/* Confirmar Senha */}
                                    <div className={`form-group has-feedback ${
                                                touched.confirmarSenha && errors.confirmarSenha ? "has-error" : ""
                                                }`}>
                                        
                                        <label>Confirmar Senha:</label>  
                                        <Field
                                            type="password"
                                            name="confirmarSenha"
                                            placeholder="Confirmar senha"
                                            className={`form-control ${
                                                touched.confirmarSenha && errors.confirmarSenha ? "is-invalid" : ""
                                                }`}
                                    />
                                    
                                    <span className="glyphicon glyphicon-lock form-control-feedback" />
                                    <ErrorMessage
                                        component="span"
                                        name="confirmarSenha"
                                        className="help-block"
                                    />
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <div className="pull-right">
                                    <button type="button" className="btn btn-default btn-xs" onClick={ this.onClosed }
                                        disabled={ isSubmitting }>Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary btn-xs" 
                                        disabled={ isSubmitting }><i class="fa fa-save"></i> { isSubmitting ? "Enviado..." : "Salvar"}
                                    </button>
                                </div>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>      
        );
    }
}

const mapStateToPros = state => ({ alterarSenhaErrors: state.usuarios.alterarSenha.errors })
//const mapDispatchToProps = dispatch => bindActionCreators({ alterarSenhaRequest },dispatch)

export default connect(null, null)(AlterarSenhaModal);