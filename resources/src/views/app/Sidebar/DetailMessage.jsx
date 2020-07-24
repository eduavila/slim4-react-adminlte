import React from 'react';
import moment from 'moment';

const DetailMessage = (props) => {
    return (
        <div className="pop-sidebar-left">
            <div className="pop-siderbar-content">
                <div className="header-sidebar">
                    <button type="button" class="close" aria-label="Close" onClick={props.onClose}>
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="post">
                    <div className="user-block">
                        <img className="img-circle img-bordered-sm" src="./images/user.png" alt="user image" />
                        <span className="username" title={`${props.message.usuario_de}-${props.message.usuario_de_descri}`}>
                            { props.message.usuario_de_descri }
                            {/* <a href="#" className="pull-right btn-box-tool"><i className="fa fa-times" /></a> */}
                        </span>
                        <span className="description">{ moment(props.message.created_at).fromNow() }</span>
                    </div>
                    {/* /.user-block */}
                    <p dangerouslySetInnerHTML={{ __html: props.message.mensagem }} />
                </div>
            </div>
        </div>
    )
}

export default DetailMessage;