import { HYDRATE } from 'next-redux-wrapper';
import * as diff from 'lodash.xorby';
import {
    ADD_FARM_BUILDING,
    SET_FARM_BUILDINGS,
    REMOVE_FARM_BUILDING,
} from './types';

const reducer = (
    state = [],
    action,
) => {
    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, action.payload, 'id');
            return [
                ...state,
                ...stateDiff,
            ];
        case SET_FARM_BUILDINGS:
            return [ ...action.payload ];
        case ADD_FARM_BUILDING:
            return [ ...state, action.payload ];
        case REMOVE_FARM_BUILDING:
            return state.filter(
                (farmBuilding) => farmBuilding.id !== action.payload,
            );
        default:
            return [...state];
    }
};

export default reducer;
