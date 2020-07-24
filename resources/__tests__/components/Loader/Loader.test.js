import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store'; // Smart components

import Loader from '../../../src/components/loader/Loader';

describe('<Loader />', () => {
    describe('render()', () => {
        test('renders the component', () => {
            const wrapper = shallow(<Loader />);
        
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        test('renders com descrição', () => {
            const wrapper = shallow(<Loader description="Carregando novo registro"/>);
        
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        test('renders sem texto', () => {
            const wrapper = shallow(<Loader notViewDescription/>);
           
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});