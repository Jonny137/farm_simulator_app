import {
    ADD_FARM_BUILDING,
    SET_FARM_BUILDINGS,
    REMOVE_FARM_BUILDING,
} from './types';

export const setFarmBuildings = farmBuildings => ({
    type: SET_FARM_BUILDINGS,
    payload: farmBuildings,
});

export const addFarmBuilding = farmBuilding => ({
    type: ADD_FARM_BUILDING,
    payload: farmBuilding,
});

export const removeFarmBuilding = farmBuildingId => ({
    type: REMOVE_FARM_BUILDING,
    payload: farmBuildingId,
});
