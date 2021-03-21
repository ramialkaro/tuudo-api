import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ICourse } from 'app/shared/model/course.model';
import { getEntities as getCourses } from 'app/entities/course/course.reducer';
import { ISchool } from 'app/shared/model/school.model';
import { getEntities as getSchools } from 'app/entities/school/school.reducer';
import { getEntity, updateEntity, createEntity, reset } from './todo.reducer';
import { ITodo } from 'app/shared/model/todo.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITodoUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TodoUpdate = (props: ITodoUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { todoEntity, courses, schools, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/todo' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getCourses();
    props.getSchools();
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
        ...todoEntity,
        ...values,
        course: courses.find(it => it.id.toString() === values.courseId.toString()),
        school: schools.find(it => it.id.toString() === values.schoolId.toString()),
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
          <h2 id="tuudoApp.todo.home.createOrEditLabel" data-cy="TodoCreateUpdateHeading">
            <Translate contentKey="tuudoApp.todo.home.createOrEditLabel">Create or edit a Todo</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : todoEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="todo-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="todo-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="titleLabel" for="todo-title">
                  <Translate contentKey="tuudoApp.todo.title">Title</Translate>
                </Label>
                <AvField id="todo-title" data-cy="title" type="text" name="title" />
              </AvGroup>
              <AvGroup>
                <Label id="startAtLabel" for="todo-startAt">
                  <Translate contentKey="tuudoApp.todo.startAt">Start At</Translate>
                </Label>
                <AvInput
                  id="todo-startAt"
                  data-cy="startAt"
                  type="datetime-local"
                  className="form-control"
                  name="startAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.todoEntity.startAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="endAtLabel" for="todo-endAt">
                  <Translate contentKey="tuudoApp.todo.endAt">End At</Translate>
                </Label>
                <AvInput
                  id="todo-endAt"
                  data-cy="endAt"
                  type="datetime-local"
                  className="form-control"
                  name="endAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.todoEntity.endAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="todo-description">
                  <Translate contentKey="tuudoApp.todo.description">Description</Translate>
                </Label>
                <AvField id="todo-description" data-cy="description" type="text" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="todo-status">
                  <Translate contentKey="tuudoApp.todo.status">Status</Translate>
                </Label>
                <AvInput
                  id="todo-status"
                  data-cy="status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && todoEntity.status) || 'CREATED'}
                >
                  <option value="CREATED">{translate('tuudoApp.Status.CREATED')}</option>
                  <option value="PENDING">{translate('tuudoApp.Status.PENDING')}</option>
                  <option value="COMPLETED">{translate('tuudoApp.Status.COMPLETED')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="priorityLabel" for="todo-priority">
                  <Translate contentKey="tuudoApp.todo.priority">Priority</Translate>
                </Label>
                <AvInput
                  id="todo-priority"
                  data-cy="priority"
                  type="select"
                  className="form-control"
                  name="priority"
                  value={(!isNew && todoEntity.priority) || 'LOW'}
                >
                  <option value="LOW">{translate('tuudoApp.Priority.LOW')}</option>
                  <option value="MEDIUM">{translate('tuudoApp.Priority.MEDIUM')}</option>
                  <option value="HIGH">{translate('tuudoApp.Priority.HIGH')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="todo-course">
                  <Translate contentKey="tuudoApp.todo.course">Course</Translate>
                </Label>
                <AvInput id="todo-course" data-cy="course" type="select" className="form-control" name="courseId">
                  <option value="" key="0" />
                  {courses
                    ? courses.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="todo-school">
                  <Translate contentKey="tuudoApp.todo.school">School</Translate>
                </Label>
                <AvInput id="todo-school" data-cy="school" type="select" className="form-control" name="schoolId">
                  <option value="" key="0" />
                  {schools
                    ? schools.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/todo" replace color="info">
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
  courses: storeState.course.entities,
  schools: storeState.school.entities,
  todoEntity: storeState.todo.entity,
  loading: storeState.todo.loading,
  updating: storeState.todo.updating,
  updateSuccess: storeState.todo.updateSuccess,
});

const mapDispatchToProps = {
  getCourses,
  getSchools,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TodoUpdate);
