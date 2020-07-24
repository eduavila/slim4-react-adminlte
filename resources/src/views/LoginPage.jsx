import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {connect} from 'react-redux';
import { login } from '../actions/auth';
import FormAlert from '../components/form/FormAlert';
import Loader from '../components/loader/Loader';

class LoginPage extends Component {
    constructor(props){
        super(props)

        this.onSubmit = this.onSubmit.bind(this);
    }

    validate(values) {
        let errors = {};
        if (values.login === "") {
            errors.login = "Campo obrigatório";
        }

        if (values.senha === "") {
            errors.senha = "Campo obrigatório";
        }

        return errors;
    }

    onSubmit(values, actions) {

        this.props.dispatch(login(values.login, values.senha))
        .then(()=>{
            actions.setSubmitting(false);
        })
        .catch((err)=>{
            actions.setSubmitting(false);
        });
    }

    render() {
        return (
            <div className="login-box">
                <div className="login-logo">
                    <a href="#"><b>SGE</b></a>
                </div>

                {/* /.login-logo */}
                <div className="login-box-body">
                    <p className="login-box-msg">Faça login para iniciar sua sessão</p>

                    <Formik
                        initialValues={{ login: "", senha: "" }}
                        validate={this.validate}
                        onSubmit={this.onSubmit}>
                            
                        {({ touched, errors, isSubmitting }) =>(

                            <Form>
                                { this.props.loginError && 
                                    (<FormAlert key='errors_login' message={ this.props.loginError.msg } type='danger' />) }
                                
                                <div style={{minHeight:'100px',position:'relative'}}>
                                    {   isSubmitting 
                                        ? <Loader></Loader>
                                        :  <>
                                            {/* login */}
                                            <div className={`form-group has-feedback ${
                                                        touched.login && errors.login ? "has-error" : ""
                                                        }`}>
                                                <Field
                                                    type="text"
                                                name="login"
                                                    placeholder="Usuário"
                                                    className={`form-control ${
                                                        touched.login && errors.login ? "is-invalid" : ""
                                                        }`}
                                                />
                                                
                                                <span className="glyphicon glyphicon-user form-control-feedback" />
                                                <ErrorMessage
                                                    component="span"
                                                    name="login"
                                                    className="help-block"
                                                />
                                            </div>
                                            {/* Senha */}
                                            <div className={`form-group has-feedback ${
                                                        touched.senha && errors.senha ? "has-error" : ""
                                                        }`}>
                                                <Field
                                                    type="password"
                                                    name="senha"
                                                    placeholder="Senha"
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
                                        </>
                                    }
                                </div>
                                <div className="row">
                                    {/* /.col */}
                                    <div className="col-xs-12">
                                        <button type="submit" className="btn btn-primary btn-block btn-flat" 
                                            disabled={isSubmitting}>{isSubmitting ? "Enviado..." : "Acessar"}</button>
                                    </div>
                                    {/* /.col */}   
                                    <div className="col-xs-12">
                                        <div class="alert alert-warning" style={{marginTop:'10px'}} role="alert">
                                            <small>Sistema está integrado com o <b>AD (Active Directory)</b>, possibilitando o Acesso através do usuário e senha utilizado para logar na maquina!<br />
                                            <b>DTIC</b> - Departamento de Tecnologia da Informação</small>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        );
    }
}



const mapStateToProps = state => ( { user: state.auth.user, loginError: state.auth.loginError } );

export default connect(mapStateToProps)(LoginPage);