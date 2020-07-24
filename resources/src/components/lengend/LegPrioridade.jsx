import React from 'react';

export default props =>{
    if(!props.cor) return null;

    return (
        <span style={{backgroundColor: props.cor, width: "1.5rem", height: "1.5rem", display: "inline-block"}}>
        </span>
    )    
} 