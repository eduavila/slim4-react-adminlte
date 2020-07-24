import React from 'react';
import './LabelFile.scss';

export default props => (
    <span className="label-file">{props.text.replace('.','').toLocaleUpperCase()}</span>
)
