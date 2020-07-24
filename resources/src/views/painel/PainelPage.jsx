import React from 'react';
import { Grid } from '../../components/layout';
import GraficoStatus from './GraficoStatus';

export default (props) =>{
    return (
        <div className="content">
            <div className="container-full">
                <section className="content-header">
                    <h1>Tarefas</h1>
                    
                    <ol className="breadcrumb">
                        <li><a href="#">Início</a></li>
                        <li className="active">Painel</li>
                    </ol>
                </section>

                {/* Main content */}
                <section className="content">

                    <Grid cols="12 12 4 4" >
                        <GraficoStatus />
                    </Grid>

                    <div className="clearfix"></div>
                </section>
            </div>
        </div>
    )
}