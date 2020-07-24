import React, {Component} from 'react';

export default class Footer extends Component {
    
    render(){
        return (
            <footer className="main-footer">
                <div className="pull-right hidden-xs">
                    <b>Version</b> { global.appVersion }
                </div>
                <strong>Copyright © 2019 <a href="#">DTIC Lucas do Rio Verde-MT</a>.</strong> All rights reserved.
            </footer>
        )
    }
}