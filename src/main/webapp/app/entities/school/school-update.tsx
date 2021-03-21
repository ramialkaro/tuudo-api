import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './school.reducer';
import { ISchool } from 'app/shared/model/school.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ISchoolUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SchoolUpdate = (props: ISchoolUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { schoolEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/school');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...schoolEntity,
        ...values,
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
          <h2 id="tuudoApp.school.home.createOrEditLabel" data-cy="SchoolCreateUpdateHeading">
            <Translate contentKey="tuudoApp.school.home.createOrEditLabel">Create or edit a School</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : schoolEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="school-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="school-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="school-name">
                  <Translate contentKey="tuudoApp.school.name">Name</Translate>
                </Label>
                <AvField id="school-name" data-cy="name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label id="urlLabel" for="school-url">
                  <Translate contentKey="tuudoApp.school.url">Url</Translate>
                </Label>
                <AvField id="school-url" data-cy="url" type="text" name="url" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/school" replace color="info">
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
  schoolEntity: storeState.school.entity,
  loading: storeState.school.loading,
  updating: storeState.school.updating,
  updateSuccess: storeState.school.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SchoolUpdate);
