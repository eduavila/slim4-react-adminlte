import React, { Component } from 'react';
import DayPickerInput from "react-day-picker/DayPickerInput";
import MomentLocaleUtils from 'react-day-picker/moment'
import "react-day-picker/lib/style.css";
import moment from 'moment';
import 'moment/locale/pt-br';

const customStyle = {
    width: "100%",
    border: "none",
    backgroundColor: "transparent"
};

class PickerButton extends Component {
    constructor(props) {
        super(props);
    }
    focus() {
        this.input.focus();
    };
    render() {
        let { value, onFocus, onBlur } = this.props;
        return (
            <React.Fragment>
                {
                    this.props.readOnly 
                    ? <div style={{marginBottom:"10px"}}><em>{ moment(value).format('DD/MM/YYYY') }</em></div>
                    :  <button ref={el => (this.input = el)} style={customStyle} onBlur={onBlur} onClick={onFocus}>
                        <em>{ moment(value).format('DD/MM/YYYY') }</em>
                        <span class="caret" style={{ marginLeft: "10px" }}></span>
                    </button>
                }
            </React.Fragment>
        );
    }   
}

class DataSelect extends Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this);
    }
    onChange(selectedDay, modifiers, dayPickerInput) {
        if (this.props.onChange) {
            this.props.onChange(selectedDay);
        }
    }

    render() {
        return (
            <div>
                <label className="control-label" >
                    {this.props.description}
                </label>
                <div class={`dropdown`} style={{marginTop: '3px'}}>
                    <DayPickerInput
                        component={props => {
                            return <PickerButton {...props } value={this.props.value} />
                        }}
                        value={this.props.value}
                        readOnly={this.props.readOnly}
                        dayPickerProps={{
                            selectedDay: { from: this.props.value },
                            locale: 'pt-br',
                            localeUtils: MomentLocaleUtils
                        }}
                        inputProps={{
                            readOnly:this.props.readOnly
                        }}
                        onDayChange={this.onChange}
                        />
                </div>
            </div>
        );
    }
}

export default DataSelect
