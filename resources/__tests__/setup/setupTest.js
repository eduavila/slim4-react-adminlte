import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from "axios-mock-adapter";
import configureMockStore from 'redux-mock-store';
import axios from "axios";
import thunk from 'redux-thunk';

configure({ adapter: new Adapter() });

//Adiciona Mock para axios
export const mockAxios = new MockAdapter(axios);
global.mockAxios = mockAxios;


// Cria mock para store do redux
export const mockStore = (dataMock) =>{
   const middlewares = [thunk];
   const store = configureMockStore(middlewares);
   return store(dataMock);
}
global.mockStore = mockStore