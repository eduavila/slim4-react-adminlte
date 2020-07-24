import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import difference from 'lodash/difference';

const toCssClasse = (numbers) => {
    const cols = numbers ? numbers.split(' ') : []
    let classes = ''

    if (cols[0]) classes += ` col-xs-${cols[0]}`
    if (cols[1]) classes += ` col-sm-${cols[1]}`
    if (cols[2]) classes += ` col-md-${cols[2]}`
    if (cols[3]) classes += ` col-lg-${cols[3]}`

    return classes;
}
//
// Custom CSS do component select
const customStyles = {
    option: (provided, state) => ({
      ...provided
    })
}

const defaultLabel = (option)=> `${option.id} - ${option.nome}`;

// create our ref
let refSelect=null;

const SelectField = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors, setFieldValue, setFieldTouched, handleChange }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
}) => {
    
    const valueRef = React.useRef();
    //  Verifica se multiselecao.
    let values = null;
    if(props.options){
        if(props.isMulti && field.value){
            values = props.options.filter(opt => {
                return field.value.includes(opt.id)
            });
        }else{
            values = props.options.find(opt => opt.id === field.value);
        }
    }

    return (
        <div className={`form-group ${toCssClasse(props.cols || `12`)} has-feedback ${touched[field.name] && errors[field.name] ? "has-error" : ""}`}>
            <label className="control-label">
                {props.description}
                {props.isRequired &&
                    <span style={{ color: 'red' }} title="Campo Obrigatório"><b>*</b></span>}
            </label>
            <div>
                <Select {...field} 
                    {...props}
                    ref={(ref)=> refSelect = ref }
                    isDisabled={ props.readOnly }
                    defaultValue={ values }
                    className={`${touched[field.name] && errors[field.name] ? "is-invalid" : ""}`} 
                    placeholder="Selecione..." 
                    styles={customStyles}
                    getOptionLabel ={props.getOptionLabel ? props.getOptionLabel : defaultLabel}
                    getOptionValue ={(option)=> option.id}
                    onChange={ (option,actions,e) => {

                        if(Array.isArray(option)){
                            const options = option.map(value => value.id);
                            // Antes de alterar
                            if(props.onBeforeChange){
                                var optionsChange = {
                                    cancel: false
                                };
                                //Busca alterações realizada entre as seleção.
                                const valuesDiff = difference(options,field.value);

                                //Recebe uma promise para definir se vai ou não setar valores.
                                let promiseBefore = props.onBeforeChange(options, valuesDiff, optionsChange);
                                promiseBefore
                                    .then(({ cancel })=>{
                                        // Cancelou a seleção.
                                        if(cancel)return;
                                        setFieldValue(field.name,options);
                            
                                        // Depois de alterar
                                        if(props.onChange){
                                            props.onChange(options);
                                        }
                                    });
                            }else{
                                // Seta valores
                                setFieldValue(field.name,options);
                                                            
                                // chama on change com alterações realizadas
                                if(props.onChange){
                                    props.onChange(options);
                                }
                            }
                        }else if (option){
                            
                            if(props.onBeforeChange){
                                //Recebe uma promise para definir se vai ou não setar valores.
                                let promiseBefore = props.onBeforeChange(option['id']);
                                promiseBefore
                                    .then(({ cancel })=>{
                                        // Cancelou a seleção.
                                        if(cancel){
                                            //Seta formik valor como null
                                            setFieldValue(field.name,null);
                                            //Limpa campo de seleção.
                                            refSelect.select.clearValue();
                                            return;
                                        }
                                        //Atualiza valor no componente.
                                        setFieldValue(field.name, option['id']);
                                        // Depois de alterar
                                        if(props.onChange){
                                            props.onChange(option);
                                        }
                                    });
                            }else{  
                                setFieldValue(field.name, option['id']);

                                if(props.onChange){
                                    props.onChange(option,{ setFieldValue });
                                }
                            }
                        }else{
                            setFieldValue(field.name,props.isMulti ? [] : null);

                            if(props.onChange){
                                props.onChange(options);
                            }
                        }
                    }} //Aplica valor no campo
                    isSearchable
                    value={ values }
                    theme={theme => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                            ...theme.colors,
                            primary: "#3c8dbc"
                        },
                    })} />
            </div>  
            
            {touched[field.name] &&
                errors[field.name] && <div className="help-block">{errors[field.name]}</div>}
        </div>
    )
};

export default SelectField;