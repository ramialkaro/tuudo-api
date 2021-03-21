import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITodo } from 'app/shared/model/todo.model';
import { getEntities as getTodos } from 'app/entities/todo/todo.reducer';
import { getEntity, updateEntity, createEntity, reset } from './todo-history.reducer';
import { ITodoHistory } from 'app/shared/model/todo-history.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITodoHistoryUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TodoHistoryUpdate = (props: ITodoHistoryUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { todoHistoryEntity, todos, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/todo-history');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }

    props.getTodos();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.startAt = convertDateTimeToServer(values.startAt);
    values.endAt = convertDateTimeToServer(values.endAt);

    if (errors.length === 0) {
      const entity = {
        ...todoHistoryEntity,
        ...values,
        todo: todos.find(it => it.id.toString() === values.todoId.toString()),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="tuudoApp.todoHistory.home.createOrEditLabel" data-cy="TodoHistoryCreateUpdateHeading">
            <Translate contentKey="tuudoApp.todoHistory.home.createOrEditLabel">Create or edit a TodoHistory</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : todoHistoryEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="todo-history-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="todo-history-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="startAtLabel" for="todo-history-startAt">
                  <Translate contentKey="tuudoApp.todoHistory.startAt">Start At</Translate>
                </Label>
                <AvInput
                  id="todo-history-startAt"
                  data-cy="startAt"
                  type="datetime-local"
                  className="form-control"
                  name="startAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.todoHistoryEntity.startAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="endAtLabel" for="todo-history-endAt">
                  <Translate contentKey="tuudoApp.todoHistory.endAt">End At</Translate>
                </Label>
                <AvInput
                  id="todo-history-endAt"
                  data-cy="endAt"
                  type="datetime-local"
                  className="form-control"
                  name="endAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.todoHistoryEntity.endAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="todo-history-todo">
                  <Translate contentKey="tuudoApp.todoHistory.todo">Todo</Translate>
                </Label>
                <AvInput id="todo-history-todo" data-cy="todo" type="select" className="form-control" name="todoId">
                  <option value="" key="0" />
                  {todos
                    ? todos.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/todo-history" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  todos: storeState.todo.entities,
  todoHistoryEntity: storeState.todoHistory.entity,
  loading: storeState.todoHistory.loading,
  updating: storeState.todoHistory.updating,
  updateSuccess: storeState.todoHistory.updateSuccess,
});

const mapDispatchToProps = {
  getTodos,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TodoHistoryUpdate);
