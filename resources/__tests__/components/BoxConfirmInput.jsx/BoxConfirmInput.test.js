import React from 'react';
import { shallow,mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import BoxConfirmInput from '../../../src/components/bootbox/BoxConfirmInput';

describe('<BoxConfirmInput />', () => {
    describe('render()', () => {
        test('renders the component', () => {
            const wrapper = shallow(<BoxConfirmInput show={true} onClose={()=>{ }} onConfirm={()=>{ }} />);
        
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        test('Click botao confirmar', () => {
            const mockOnClick = jest.fn();
            const wrapper = mount(<BoxConfirmInput show={true} onClose={()=>{ }} onConfirm={mockOnClick} />);

            wrapper.find('input').first().simulate('change', { target: { value: 'Texto de confirmação .' } })
            wrapper.find('.btn-primary').first().simulate('click');

            expect(mockOnClick.mock.calls.length).toEqual(1);
        });

        test('Click botao cancelar', () => {
            const mockOnClick = jest.fn();
            const wrapper = mount(<BoxConfirmInput show={true} onClose={mockOnClick} onConfirm={mockOnClick} />);

            wrapper.find('.btn-secondary').first().simulate('click');

            expect(mockOnClick.mock.calls.length).toEqual(1);
            expect(mockOnClick.mock.calls[0][0]).toEqual({ isCancel:true });
        });

        test('Click botao cancelar', () => {
            const mockOnClick = jest.fn();
            const wrapper = mount(<BoxConfirmInput show={true} onClose={mockOnClick} onConfirm={mockOnClick} />);

            wrapper.find('button.close').first().simulate('click');

            expect(mockOnClick.mock.calls.length).toEqual(1);
            expect(mockOnClick.mock.calls[0][0]).toEqual({ isCancel:false });
        });
    });
});