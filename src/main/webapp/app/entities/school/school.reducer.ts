import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ISchool, defaultValue } from 'app/shared/model/school.model';

export const ACTION_TYPES = {
  FETCH_SCHOOL_LIST: 'school/FETCH_SCHOOL_LIST',
  FETCH_SCHOOL: 'school/FETCH_SCHOOL',
  CREATE_SCHOOL: 'school/CREATE_SCHOOL',
  UPDATE_SCHOOL: 'school/UPDATE_SCHOOL',
  PARTIAL_UPDATE_SCHOOL: 'school/PARTIAL_UPDATE_SCHOOL',
  DELETE_SCHOOL: 'school/DELETE_SCHOOL',
  RESET: 'school/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISchool>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type SchoolState = Readonly<typeof initialState>;

// Reducer

export default (state: SchoolState = initialState, action): SchoolState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_SCHOOL_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SCHOOL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_SCHOOL):
    case REQUEST(ACTION_TYPES.UPDATE_SCHOOL):
    case REQUEST(ACTION_TYPES.DELETE_SCHOOL):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_SCHOOL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_SCHOOL_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SCHOOL):
    case FAILURE(ACTION_TYPES.CREATE_SCHOOL):
    case FAILURE(ACTION_TYPES.UPDATE_SCHOOL):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_SCHOOL):
    case FAILURE(ACTION_TYPES.DELETE_SCHOOL):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_SCHOOL_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_SCHOOL):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_SCHOOL):
    case SUCCESS(ACTION_TYPES.UPDATE_SCHOOL):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_SCHOOL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_SCHOOL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/schools';

// Actions

export const getEntities: ICrudGetAllAction<ISchool> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_SCHOOL_LIST,
  payload: axios.get<ISchool>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<ISchool> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SCHOOL,
    payload: axios.get<ISchool>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ISchool> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SCHOOL,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ISchool> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SCHOOL,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<ISchool> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_SCHOOL,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ISchool> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SCHOOL,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
