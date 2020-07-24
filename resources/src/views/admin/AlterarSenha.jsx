import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Text, TextArea, Select, DatePicker } from '../../components/form';

import Modal from 'react-bootstrap/lib/Modal';
import FormAlert from '../../components/form/FormAlert';
import LoaderModal from '../../components/loader/LoaderModal';
import { addError, addSuccess } from '../../actions/toasts';
import { saveSenha } from '../../actions/usuarios';


class AlterarSenha extends Component {
    constructor(props){
        super(props)

        this.state = {
            usuarioLoading: true
        }
    }

    validate(values) {
        let errors = {};
        if (values.senha === "") {
            errors.senha = "Campo obrigatório";
        }

        if (values.confirmar_senha === "") {
            errors.confirmar_senha = "Campo obrigatório";
        }

        if (values.confirmar_senha != values.senha){
            errors.confirmar_senha = "Senha estão divergentes!";
        }

        return errors;
    }

    onSubmit = (values, actions) => {   
        this.props
            .saveSenha(values)
            .then(()=>{
                actions.setSubmitting(false);
                this.props.onClose(null);
            })
            .catch(()=>{
                actions.setSubmitting(false);
            });
    }

    onClosed(){
        if(this.props.onClosed){
            this.props.onClosed();
        }
    }

    render() {        

        return (
            <Formik
                initialValues={{ senha: "", confirmarSenha: "", id: this.props.item.usuarioId}}
                validate={this.validate}
                onSubmit={this.onSubmit}>
                        
                    {({ touched, errors, isSubmitting }) =>(

                    <Form>
                        <Modal.Header closeButton>
                            <Modal.Title>Alterar Senha</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>                            
                            <div className={`form-group has-feedback `}>
                                <label>Senha:</label>
                                <Field name="id" description="ID:" type="Text" className={`form-control`} readOnly />
                            </div>
                            { this.props.alterarSenhaErrors && 
                                (<FormAlert key='errors_login' message={ this.props.alterarSenhaErrors.msg } type='danger' />) }
                                {/* Senha */}
                                <div className={`form-group has-feedback ${ touched.senha && errors.senha ? "has-error" : "" }`}>
                                    <label>Senha:</label>
                                    <Field  type="password" name="senha" placeholder="Nova senha" autoComplete="off" className={`form-control ${ touched.senha && errors.senha ? "is-invalid" : "" }`} />                                    
                                    <span className="glyphicon glyphicon-lock form-control-feedback" />
                                    <ErrorMessage component="span" name="senha" className="help-block" />
                                </div>
                                {/* Confirmar Senha */}
                                <div className={`form-group has-feedback ${ touched.confirmarSenha && errors.confirmarSenha ? "has-error" : "" }`} >                                    
                                    <label>Confirmar Senha:</label>  
                                    <Field type="password" name="confirmar_senha" placeholder="Confirmar senha" autoComplete="off" className={`form-control ${ touched.confirmarSenha && errors.confirmarSenha ? "is-invalid" : "" }`}/>                                
                                <span className="glyphicon glyphicon-lock form-control-feedback" />
                                <ErrorMessage component="span" name="confirmarSenha" className="help-block" />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="pull-right">
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
    }
}

const mapStateToPros = state => ({ alterarSenhaErrors: state.usuarios.alterarSenha.errors });
const mapDispatchToProps = dispatch => bindActionCreators({ saveSenha },dispatch);

export default connect(mapStateToPros, mapDispatchToProps)(AlterarSenha);