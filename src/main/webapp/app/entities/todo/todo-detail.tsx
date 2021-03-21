import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './todo.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITodoDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TodoDetail = (props: ITodoDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { todoEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="todoDetailsHeading">
          <Translate contentKey="tuudoApp.todo.detail.title">Todo</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{todoEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="tuudoApp.todo.title">Title</Translate>
            </span>
          </dt>
          <dd>{todoEntity.title}</dd>
          <dt>
            <span id="startAt">
              <Translate contentKey="tuudoApp.todo.startAt">Start At</Translate>
            </span>
          </dt>
          <dd>{todoEntity.startAt ? <TextFormat value={todoEntity.startAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="endAt">
              <Translate contentKey="tuudoApp.todo.endAt">End At</Translate>
            </span>
          </dt>
          <dd>{todoEntity.endAt ? <TextFormat value={todoEntity.endAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="tuudoApp.todo.description">Description</Translate>
            </span>
          </dt>
          <dd>{todoEntity.description}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="tuudoApp.todo.status">Status</Translate>
            </span>
          </dt>
          <dd>{todoEntity.status}</dd>
          <dt>
            <span id="priority">
              <Translate contentKey="tuudoApp.todo.priority">Priority</Translate>
            </span>
          </dt>
          <dd>{todoEntity.priority}</dd>
          <dt>
            <Translate contentKey="tuudoApp.todo.course">Course</Translate>
          </dt>
          <dd>{todoEntity.course ? todoEntity.course.id : ''}</dd>
          <dt>
            <Translate contentKey="tuudoApp.todo.school">School</Translate>
          </dt>
          <dd>{todoEntity.school ? todoEntity.school.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/todo" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/todo/${todoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ todo }: IRootState) => ({
  todoEntity: todo.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TodoDetail);
