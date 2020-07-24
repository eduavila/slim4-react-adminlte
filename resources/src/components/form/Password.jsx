import React from 'react';

const toCssClasse = (numbers) => {
  const cols = numbers ? numbers.split(' ') : []
  let classes = ''

  if (cols[0]) classes += ` col-xs-${cols[0]}`
  if (cols[1]) classes += ` col-sm-${cols[1]}`
  if (cols[2]) classes += ` col-md-${cols[2]}`
  if (cols[3]) classes += ` col-lg-${cols[3]}`

  return classes;
}

const Password = ({
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

      <input type="password" {...field} {...props} className={`form-control ${touched[field.name] && errors[field.name] ? "is-invalid" : ""}`} />

      {touched[field.name] &&
        errors[field.name] && <div className="help-block">{errors[field.name]}</div>}
    </div>
  )
};

export default Password;