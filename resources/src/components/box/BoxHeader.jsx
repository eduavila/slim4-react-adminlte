import React from  'react'

export default props => (
    <div className={ `box-header ${props.border ? ' with-border' :''}`}>{props.children}</div>
)

