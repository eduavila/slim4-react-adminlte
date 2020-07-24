import React from 'react';
import './Progress.scss';
import { Grid } from '../layout';

export default props => (
    <div className="progress-group">
        <span className="col-xs-10 max-text progress-text" title={props.text}>{props.text ? props.text : ''}</span>
        <span className="col-xs-2 text-right progress-number"><b>{props.value ? props.value : 0}</b>/{props.max ? props.max : '100'}</span>

        <Grid className={`col-xs-12 progress ${props.size ? props.size : ''}`} style={{marginBottom: '10px'}}>
            <div className={`progress-bar progress-bar-${props.class ? props.class : 'primary'}`} role="progressbar" 
                aria-valuenow={(props.value * 100)/props.max} 
                aria-valuemin={0} 
                aria-valuemax={100} 
                title={`${(props.value * 100)/props.max} %`}
                style={{width: `${ (props.value * 100)/props.max }%`}} />
        </Grid>
    </div>
)


