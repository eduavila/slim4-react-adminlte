import React,{ Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import NoData from 'highcharts/modules/no-data-to-display';

import { Box,BoxHeader,BoxFooter,BoxBody } from '../../components/box';

//Aplica modulo NoData no highcharts
NoData(Highcharts);

class GraficoStatus extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            isLoading:true,
            dataSerie:[
                
            ]
        }
    }

    componentDidMount() {
        this.chart = this.refs.chartComponent.chart;
    }

    configCharts(){
        return {
            title: {
              text: ''
            },
            credits: {
                enabled: false
            },
            lang: {
                noData: 'Não há dados para exibir.'
            },
            tooltip: {
                pointFormat: '<b>Total: {point.y} ({point.percentage:.2f} %)</b>'
            },
            chart: {
                height: 230,
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y} ({point.percentage:.2f}%)'
                    }
                }
            },
            series: [{
                colorByPoint: true,
                data: []
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 299
                    }
                }]
            }
        };
    }
    
    render(){
        return ( 
            <Box className="box-none" style={{ height:"299px" }}>
                <BoxHeader>
                    <h3 class="box-title"><i class="fa fa-dashboard"></i>Gráfico exemplo</h3>
                </BoxHeader>
                <BoxBody>
                    <HighchartsReact 
                        allowChartUpdate={false}
                        ref={"chartComponent"}
                        highcharts={Highcharts} 
                        options={this.configCharts()} />
                </BoxBody>
            </Box>
        )
    }
}


export default GraficoStatus;