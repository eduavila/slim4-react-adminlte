import React from 'react';
import { Checkbox } from 'react-icheck';
import { toCssClasse } from '../../helpers/utils';

const Checked = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors,setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {

    return (
        <div className={`form-group ${toCssClasse(props.cols || `12`)} has-feedback ${touched[field.name] && errors[field.name] ? "has-error" : ""}`}>
            <label className="control-label" style={{display:'block'}}>
                {props.description || ''}
                {props.isRequired &&
                <span style={{ color: 'red' }} title="Campo Obrigatório"><b>*</b></span>}
                { props.helpDescription && 
                    <i className="fa fa-question-circle" title={ props.helpDescription }></i> 
                }
            </label>

            <Checkbox
                {...field}
                {...props}
                id={field.name}
                checkboxClass={`icheckbox_flat-blue`}
                disabled={props.readOnly}
                disabledClass='readonly'
                increaseArea="15%"
                value={field.checkedValue ? checkedValue : false}
                checked={field.value}
                onChange={e => setFieldValue(field.name,!field.value)}
                className={`form-control ${touched[field.name] && errors[field.name] ? "is-invalid" : ""}`}
            />

            { touched[field.name] &&
                errors[field.name] && <div className="help-block">{errors[field.name]}</div>}
        </div>
    )
};

export default Checked;