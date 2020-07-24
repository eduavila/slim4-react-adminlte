import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Checked from '../../../src/components/form/Checked';

describe('<Checked />', () => {
    const mockSetFieldValue = jest.fn();
    const mockSetFieldTouched = jest.fn();

    const mockProps = {
        field:{
            name: 'check_mock',
            value: false
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
            const wrapper = shallow(<Checked { ...mockProps }/>);
        
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        test('click para checkar Checked', () => {
            const wrapper = mount(<Checked { ...mockProps }/>);

            wrapper.find('#check_mock').simulate('change', { target: { value: true } });

            expect(mockSetFieldValue.mock.calls.length).toEqual(1);
            expect(mockSetFieldTouched.mock.calls.length).toEqual(1);

            expect(mockSetFieldValue.mock.calls[0][1]).toEqual(true);
        });

        test('Message de erro no Checked', () => {
            const mockForm = {
                ...mockProps.form,
                touched: {
                    check_mock: true
                }, 
                errors: {
                    check_mock:'Teste de erro.'
                }
            }
            const wrapper = mount(<Checked field={mockProps.field} {...mockProps.props} form={mockForm}/>);

            const text = wrapper.find('.help-block').text();
            expect(text).toEqual(mockForm.errors.check_mock);
        });
    });
});
