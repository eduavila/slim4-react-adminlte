import React, { Component } from 'react';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { contextMenu } from 'react-contexify';
import Loader from '../loader/Loader';
import 'react-contexify/dist/ReactContexify.min.css';

import './DataTable.scss';
import { Row,Grid } from '../layout';

const { SearchBar } = Search;

class DataTable extends Component {
    constructor(props){
        super(props)

        this.table = React.createRef();

        this.pagination = paginationFactory({
            sizePerPageList: [ this.props.perPage || 10 ]
        });

        //Aplica evento de expand 
        this.state = {
            dataRaw: this.props.data || [],
            columns: this.props.columns,
            expanded: []
        };

        if(this.props.contentMenu){
            
            const handleEvent = (e,row)=>{
                e.preventDefault();
                contextMenu.show({
                  id: 'contentMenu',
                  event: e,
                  props: {
                    row: row
                  }
                });
            }
            
            const columns = this.state.columns;
            const exists = columns.find((col)=> col.dataField == 'conf_datatable');

            if(!exists){
                columns.unshift({
                    dataField: 'conf_datatable',
                    text: '#',
                    style: {
                        width: '40px'
                    },
                    headerClasses:'col-fixed-left',
                    classes: 'col-fixed-left',
                    formatter: (cell,row)=>{
                        return (       
                            <i class="fa fa-cog" onClick={(e) => handleEvent(e,row)} aria-hidden="true"></i>
                        )
                    }
                });

                this.setState({
                    ...this.state,
                    columns
                });
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            dataRaw: nextProps.data || []
        };
    }

    searchFilter = ({
        searchText,
        value,
        column,
        row
    })=>{

        if(searchText.length > 2){
            this.setState({
                ...this.state,
                expanded: []
            });

            const expand = this.node.table.props.data.map(value => value.id);

            this.setState({
                ...this.state,
                expanded: expand
            });
        }
        // }else{
        //     this.setState({
        //         ...this.state,
        //         expanded: []
        //     });
        // }
       
        let search = false;
        if(this.props.searchTree && this.props.searchTree.includes(column.dataField)){
            
            if(Array.isArray(value)){

                value.forEach(function(valor, chave){
                    for (let col in valor) {
                        const result = valor[col];
                        if(!Array.isArray(result) && !Object.is(result)  && typeof result !== 'undefined' && result !== null){
                            if(result.toString().toLowerCase().includes(searchText.toLowerCase())) 
                            {
                                search = true 
                            }
                        }
                    }
                });

                return search;
            }else if(Object.is(value)) {
                for (let columnValue in value) {
    
                    const result = value[columnValue];
                    if(!Array.isArray(result) && !Object.is(result)){
                        if( result.includes(searchText)) 
                        {
                            search = true 
                        }
                    }
                }
            }
            else{
                if  (typeof value !== 'undefined' && value !== null) {
                    return value.includes(searchText);
                }
                return false;
            }
       
        }else{
            if(Array.isArray(value) || Object.is(value)) return false;
            
            if (typeof value !== 'undefined' && value !== null) {
                return value.toString().toUpperCase().includes(searchText.toUpperCase());
            }
            return false;
        }
    }

    // Configura sub tabela da linhas.
    renderExpand = () => {
        return  {
            renderer:this.props.expandRow, 
            showExpandColumn: this.props.expandRow ? true : false,
            expandByColumnOnly: false,
            
            expandHeaderColumnRenderer: ({ isAnyExpands }) => {
                if (isAnyExpands) {
                    return <i class="fa fa-minus-square" aria-hidden="true"></i>;
                }
                return <i class="fa fa-plus-square" aria-hidden="true"></i>;
            },
            expandColumnRenderer: ({ expanded, rowKey, expandable }) => {
                if (expanded) {
                    return <i class="fa fa-minus-square" aria-hidden="true"></i>;
                }
                return <i class="fa fa-plus-square" aria-hidden="true"></i>;
            },
            onExpand: (row, isExpand, rowIndex, e) =>{
                if (isExpand) {
                    this.setState({
                        ...this.state,
                        expanded: [...this.state.expanded, row.id]
                    });
                } else {
                    this.setState({
                        ...this.state,
                        expanded: this.state.expanded.filter(x => x !== row.id)
                    });
                }
            },
            expanded: this.state.expanded
        };
        
    }

    render(){
        // if(this.props.loading){
        //     return  (
        //         <div className="datatable" style={{ minHeight: this.props.minHeigth }}>
        //             <Loader />
        //         </div>
        //     )
        // }else{
            if(this.props.noDataMsg.length > 0 && this.state.dataRaw.length == 0){
                return (
                    <div className="datatable no-data" style={{ minHeight: this.props.minHeigth }}>
                         <Grid className="form-group pull-left" cols="12 6 6 6">
                            { this.props.actions && this.props.actions() }
                        </Grid>
                        <div className="no-data-content">
                            <h2>
                                {this.props.noDataMsg}
                            </h2>
                            <p>
                                {this.props.noDataSubMsg}
                            </p>
                        </div>
                    </div>
                )
            }
            return (
                <div>
                    <ToolkitProvider
                        data={ this.state.dataRaw }
                        columns={ this.state.columns }
                        keyField="id"
                        search={ { onColumnMatch: this.searchFilter } }
                        >
                        {
                            props => (

                                <div>
                                    <div className="datatable row-action">
                                        <Grid className="form-group pull-left" cols="12 6 6 6">
                                            { this.props.actions && this.props.actions() }
                                        </Grid>

                                        { this.props.search && (
                                            <Grid className="form-group pull-right" style={{paddingRight:'0'}} cols="12 12 3 3">
                                                <SearchBar { ...props.searchProps } 
                                                    placeholder="Pequisar"
                                                    className={`form-control pull-right ${this.props.sm ? 'input-sm' :''} `} />
                                            </Grid>
                                        )}
                                    </div>
                                  
                                    <div className="datatable table-responsive">
                                        
                                        <BootstrapTable 
                                            { ...props.baseProps }
                                            classes={`${this.props.sm ? 'table-sm' :''} table-hover `}
                                            condensed
                                            keyField='id'
                                            ref={ n => { this.node = n; }}
                                            pagination={ this.pagination }
                                            expandRow={ this.renderExpand() }
                                            bordered={ true } 
                                            //noDataIndication={ () => }
                                        />
                                        { this.props.loading && <Loader />}
                                    </div>
                                </div>
                            )
                        }
                    </ToolkitProvider>

                    { this.state.dataRaw.length == 0 && !this.props.loading && ( <p className="text-center"> Nenhum registro. </p> )}

                    {  this.props.contentMenu && this.props.contentMenu() }
                </div>
            )
        //}
    }
}

DataTable.defaultProps = {
    noDataMsg:'',
    noDataSubMsg: '',
    loading:false,
    minHeigth:'400px',
    perPage:10,
    search:true,
    searchTree: null // Filter faz 
}

export default DataTable
