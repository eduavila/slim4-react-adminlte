import React from 'react';

import './Loader.scss';

export default props => {
    return (
        <div className={`ui small segment ${ props.content ? ` content-preloader`:``}` }>
            <div className="ui active inverted dimmer">
                <div className={`ui loader ${ !props.notViewDescription ? 'text':'' } ${ props.size }`}>
                    { !props.notViewDescription ? ( props.description || 'Carregando..') : null }
                </div>
            </div>
        </div>
    )
}
