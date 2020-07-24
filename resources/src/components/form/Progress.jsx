import React from 'react';
import './Progress.scss';

export default props => (
    <div className={`progress ${props.size ? props.size : ''}`}>

        <div className={`progress-bar progress-bar-${props.class ? props.class : 'primary'}`} role="progressbar" 
            aria-valuenow={props.value ? props.value : 0} 
            aria-valuemin={0} 
            aria-valuemax={100} 
            style={{width: `${props.value ? props.value : 0}%`}}>
            <span>{`${props.value ? props.value : 0}%`}</span>
        </div>
    </div>
)


