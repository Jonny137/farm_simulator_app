import { createStore } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import reducer from './farm-building/reducer';

const makeStore = () => createStore(reducer);

export const wrapper = createWrapper(makeStore);
