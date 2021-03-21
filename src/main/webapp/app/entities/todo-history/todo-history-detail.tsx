import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './todo-history.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITodoHistoryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TodoHistoryDetail = (props: ITodoHistoryDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { todoHistoryEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="todoHistoryDetailsHeading">
          <Translate contentKey="tuudoApp.todoHistory.detail.title">TodoHistory</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{todoHistoryEntity.id}</dd>
          <dt>
            <span id="startAt">
              <Translate contentKey="tuudoApp.todoHistory.startAt">Start At</Translate>
            </span>
          </dt>
          <dd>
            {todoHistoryEntity.startAt ? <TextFormat value={todoHistoryEntity.startAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="endAt">
              <Translate contentKey="tuudoApp.todoHistory.endAt">End At</Translate>
            </span>
          </dt>
          <dd>{todoHistoryEntity.endAt ? <TextFormat value={todoHistoryEntity.endAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="tuudoApp.todoHistory.todo">Todo</Translate>
          </dt>
          <dd>{todoHistoryEntity.todo ? todoHistoryEntity.todo.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/todo-history" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/todo-history/${todoHistoryEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ todoHistory }: IRootState) => ({
  todoHistoryEntity: todoHistory.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TodoHistoryDetail);
