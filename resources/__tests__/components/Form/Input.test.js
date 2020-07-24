import React from 'react';
import { shallow, mount } from 'enzyme';
///import { render, fireEvent, wait } from "@testing-library/react";
import toJson from 'enzyme-to-json';
import Input from '../../../src/components/form/Input';
import { updateWrapper, waait } from '../../setup/helpersTest';

const updateField = (wrapper, name, value) => {
    wrapper.simulate('change', {
      persist: () => {},
      target: {
        name,
        value,
      },
    })
  }
const diveFind = (wrapper,query) => wrapper.find(query);


  
describe('<Input />', () => {

    const mockSetFieldValue = jest.fn();
    const mockSetFieldTouched = jest.fn();
    const mockSetFieldOnChange = jest.fn();

    const mockProps = {
        field:{
            name: 'input_mock',
            value: "Teste",
            onChange: mockSetFieldOnChange
        },
        form: { 
            touched: {}, 
            errors: {},
            setFieldValue: mockSetFieldValue, 
            setFieldTouched: mockSetFieldTouched
        },
        props:{
            descrition: 'Campo de mock:'
        }
    }

    describe('render()', () => {
        test('renders the component', () => {
            const wrapper = shallow(<Input { ...mockProps }/>);
        
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        test('Altera valor input', async () => {
            const wrapper = mount(<Input { ...mockProps }/>);

            //Procura input e aplica evento change.
            diveFind(wrapper,'input[name="input_mock"]')
                .simulate('change', {
                    persist: () => {},
                    target: { name: 'input_mock', value: 'teste' }, // invalid
                });
            
            expect(mockSetFieldOnChange.mock.calls.length).toEqual(1);
            expect(mockSetFieldOnChange.mock.calls[0][0].target.value).toEqual('teste');
        });

        test('Msg de erro', async () => {
            const form = {  
                errors: { input_mock: "Teste error" },
                touched: { input_mock: true }
            };
            const wrapper = mount(<Input {...mockProps} form={form} />);

            //Procura input e aplica evento change.
            const input = diveFind(wrapper,'input[name="input_mock"]');
            input.simulate('focus');
            input.simulate('blur');

            const text = wrapper.find('.help-block').text();
            expect(text).toEqual(form.errors.input_mock);
        });
    });
});
