import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITodo, defaultValue } from 'app/shared/model/todo.model';

export const ACTION_TYPES = {
  FETCH_TODO_LIST: 'todo/FETCH_TODO_LIST',
  FETCH_TODO: 'todo/FETCH_TODO',
  CREATE_TODO: 'todo/CREATE_TODO',
  UPDATE_TODO: 'todo/UPDATE_TODO',
  PARTIAL_UPDATE_TODO: 'todo/PARTIAL_UPDATE_TODO',
  DELETE_TODO: 'todo/DELETE_TODO',
  RESET: 'todo/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITodo>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TodoState = Readonly<typeof initialState>;

// Reducer

export default (state: TodoState = initialState, action): TodoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TODO_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TODO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TODO):
    case REQUEST(ACTION_TYPES.UPDATE_TODO):
    case REQUEST(ACTION_TYPES.DELETE_TODO):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_TODO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TODO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TODO):
    case FAILURE(ACTION_TYPES.CREATE_TODO):
    case FAILURE(ACTION_TYPES.UPDATE_TODO):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_TODO):
    case FAILURE(ACTION_TYPES.DELETE_TODO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TODO_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TODO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TODO):
    case SUCCESS(ACTION_TYPES.UPDATE_TODO):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_TODO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TODO):
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

const apiUrl = 'api/todos';

// Actions

export const getEntities: ICrudGetAllAction<ITodo> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TODO_LIST,
    payload: axios.get<ITodo>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITodo> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TODO,
    payload: axios.get<ITodo>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITodo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TODO,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITodo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TODO,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<ITodo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_TODO,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITodo> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TODO,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
