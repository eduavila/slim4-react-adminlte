
import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBr from 'date-fns/locale/pt-BR';
import { toCssClasse } from '../../helpers/utils';
registerLocale('pt-BR', ptBr);

import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";
import './TimePicker.scss';

const TimePicker = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
    return (
        <div className={`form-group ${toCssClasse(props.cols || `12`)} has-feedback ${touched[field.name] && errors[field.name] ? "has-error" : ""}`}>
            <label className="control-label" style={{display:'block'}}>
                {props.description}
                {props.isRequired &&
                <span style={{ color: 'red' }} title="Campo Obrigatório"><b>*</b></span>}
            </label>

            <DatePicker
                showTimeSelect
                selected={ field.value ? moment(field.value).toDate() : null }
                timeIntervals={15}
                timeCaption="Hora"
                locale="pt-BR"
                timeFormat="p"
                timeIntervals={15}
                {...props}
                dateFormat="dd/MM/yyyy HH:mm"
                className={`form-control ${touched[field.name] && errors[field.name] ? "is-invalid" : ""}`}
                onChange={ (date) => setFieldValue(field.name, date) }
                />

            {touched[field.name] &&
                errors[field.name] && <div className="help-block">{errors[field.name]}</div>}
        </div>
    )
};

export default TimePicker;