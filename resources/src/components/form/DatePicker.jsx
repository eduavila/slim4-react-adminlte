import React from 'react';
import DatePicker from 'react-16-bootstrap-date-picker';
import moment from 'moment';

const toCssClasse = (numbers) => {
  const cols = numbers ? numbers.split(' ') : []
  let classes = ''

  if (cols[0]) classes += ` col-xs-${cols[0]}`
  if (cols[1]) classes += ` col-sm-${cols[1]}`
  if (cols[2]) classes += ` col-md-${cols[2]}`
  if (cols[3]) classes += ` col-lg-${cols[3]}`

  return classes;
}

const Text = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors,setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
    const dayLabels = ['Do', '2º', '3º', '4º', '5º', '6º', 'Sá'];
    const monthLabels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return (
        <div className={`form-group ${toCssClasse(props.cols || `12`)} has-feedback ${touched[field.name] && errors[field.name] ? "has-error" : ""}`}>
            <label className="control-label">
                {props.description}
                {props.isRequired &&
                <span style={{ color: 'red' }} title="Campo Obrigatório"><b>*</b></span>}
            </label>

            <DatePicker 
                {...field}
                {...props}
                dateFormat={props.dateFormat ? props.dateFormat : 'DD/MM/YYYY'}
                value={ field.value ? moment(field.value).format('YYYY-MM-DD'):null}
                onChange={date => setFieldValue(field.name,date ? moment(date).format('YYYY-MM-DD') : null)}
                dayLabels={dayLabels}
                monthLabels={monthLabels}
                showClearButton={false}
                className={`form-control ${touched[field.name] && errors[field.name] ? "is-invalid" : ""}`}
                autocomplete="off" />

            {touched[field.name] &&
                errors[field.name] && <div className="help-block">{errors[field.name]}</div>}
        </div>
    )
};

export default Text;