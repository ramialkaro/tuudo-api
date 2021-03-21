import axios from 'axios';
import {
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction,
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITodoHistory, defaultValue } from 'app/shared/model/todo-history.model';

export const ACTION_TYPES = {
  FETCH_TODOHISTORY_LIST: 'todoHistory/FETCH_TODOHISTORY_LIST',
  FETCH_TODOHISTORY: 'todoHistory/FETCH_TODOHISTORY',
  CREATE_TODOHISTORY: 'todoHistory/CREATE_TODOHISTORY',
  UPDATE_TODOHISTORY: 'todoHistory/UPDATE_TODOHISTORY',
  PARTIAL_UPDATE_TODOHISTORY: 'todoHistory/PARTIAL_UPDATE_TODOHISTORY',
  DELETE_TODOHISTORY: 'todoHistory/DELETE_TODOHISTORY',
  RESET: 'todoHistory/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITodoHistory>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TodoHistoryState = Readonly<typeof initialState>;

// Reducer

export default (state: TodoHistoryState = initialState, action): TodoHistoryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TODOHISTORY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TODOHISTORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TODOHISTORY):
    case REQUEST(ACTION_TYPES.UPDATE_TODOHISTORY):
    case REQUEST(ACTION_TYPES.DELETE_TODOHISTORY):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_TODOHISTORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TODOHISTORY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TODOHISTORY):
    case FAILURE(ACTION_TYPES.CREATE_TODOHISTORY):
    case FAILURE(ACTION_TYPES.UPDATE_TODOHISTORY):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_TODOHISTORY):
    case FAILURE(ACTION_TYPES.DELETE_TODOHISTORY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TODOHISTORY_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_TODOHISTORY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TODOHISTORY):
    case SUCCESS(ACTION_TYPES.UPDATE_TODOHISTORY):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_TODOHISTORY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TODOHISTORY):
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

const apiUrl = 'api/todo-histories';

// Actions

export const getEntities: ICrudGetAllAction<ITodoHistory> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TODOHISTORY_LIST,
    payload: axios.get<ITodoHistory>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITodoHistory> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TODOHISTORY,
    payload: axios.get<ITodoHistory>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITodoHistory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TODOHISTORY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<ITodoHistory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TODOHISTORY,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<ITodoHistory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_TODOHISTORY,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITodoHistory> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TODOHISTORY,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
