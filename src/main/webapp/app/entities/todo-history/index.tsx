import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TodoHistory from './todo-history';
import TodoHistoryDetail from './todo-history-detail';
import TodoHistoryUpdate from './todo-history-update';
import TodoHistoryDeleteDialog from './todo-history-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TodoHistoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TodoHistoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TodoHistoryDetail} />
      <ErrorBoundaryRoute path={match.url} component={TodoHistory} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TodoHistoryDeleteDialog} />
  </>
);

export default Routes;
