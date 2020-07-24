import React from  'react'

export default props => (
    <div className={`row ${props.className || ''}`}>{props.children}</div>
)
