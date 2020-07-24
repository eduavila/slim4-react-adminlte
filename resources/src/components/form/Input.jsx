import React from 'react';
import { toCssClasse } from '../../helpers/utils';

const Input = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {

  return (
    <div className={`form-group ${toCssClasse(props.cols || `12`)} has-feedback ${touched[field.name] && errors[field.name] ? "has-error" : ""}`}>
      <label className="control-label">
        {props.description}
        {props.isRequired &&
          <span style={{ color: 'red' }} title="Campo Obrigatório"><b>*</b></span>}
      </label>

      <input {...field} {...props} className={`form-control ${touched[field.name] && errors[field.name] ? "is-invalid" : ""}`} />

      { touched[field.name] &&
        errors[field.name] && <div className="help-block">{errors[field.name]}</div> }
    </div>
  )
};

export default Input;