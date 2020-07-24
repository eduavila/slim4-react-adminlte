import React from  'react'

export default props => (
    <div className={`box ${props.className}`} style={props.style}>{props.children}</div>
)
