import React from 'react';
import { shallow,mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import DataTable from '../../../src/components/dataTable';

const colums = [
    {
        dataField: 'nome',
        text: 'Arquivo',
        headerStyle:{
            textAlign:'center'
        },
        style: {
            width: '50px',
            textAlign:'center'
        },
        sort: true
    },
    {
        dataField: 'tarefa_id',
        text: 'Tarefa',
        sort: true,
        headerStyle:{
            textAlign:'center'
        },
        style: {
            width: '100px'
        }
    }
]

describe('<DatTable />', () => {
    describe('render()', () => {
        test('renders the component', () => {
            const wrapper = shallow(<DataTable columns={ colums } />);
        
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        test('Deve verificar se criou tr corretamente', () => {
            const data = [
                {
                    id: 1,
                    tarefa_id: 1,
                    nome: 'Arquivos.jpg'
                },
                {
                    id: 2,
                    tarefa_id: 2,
                    nome: 'Arquivos2.jpg'
                }
            ]
            const wrapper = mount(<DataTable columns={ colums } data={data} />);

            expect(wrapper.find('tbody').find('tr').length).toEqual(2);
        });

        test('Deve verificar label de sem dados', () => {
            const data = []
            const wrapper = mount(<DataTable columns={ colums } data={data} />);

            expect(wrapper.find('.text-center').text().trim()).toEqual('Nenhum registro.');
        });

        test('Deve verificar loader carregamento', () => {
            const data = []
            const wrapper = mount(<DataTable columns={ colums } data={data}  loading={true}/>);

            expect(wrapper.find('.ui.loader').length).toEqual(1);
        });

        test('Deve verificar botoes de ações', () => {
            const data = [];
            const actions = () => (<a href="#" id="btn-acoes" className="btn btn-sm btn-primary btn-flat pull-left">Nova Ação</a>);
            const wrapper = mount(<DataTable columns={ colums } data={data} actions={ actions }/>);

            expect(wrapper.find('#btn-acoes').first().text()).toEqual('Nova Ação');
        });
    });
});