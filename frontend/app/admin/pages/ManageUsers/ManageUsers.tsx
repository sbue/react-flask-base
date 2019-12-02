import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {PageHeader, Table, Row, Col} from 'antd';
import _ from 'lodash';

import {goTo} from 'utils/history';
import {PATHS} from 'config';
import PageContent from 'components/PageContent';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {selectIsLoading} from 'reducers';

import reducer, {selectAdmin} from 'admin/reducer';
import saga from 'admin/sagas/fetchUsers';
import {fetchUsers} from 'admin/actions';
import {columns} from './tableColumns';

const key = 'admin';

export default function ManageUsers() {
  const dispatch = useDispatch();
  const adminState = useSelector(selectAdmin);
  const tableData = _.toArray(
    _.mapValues(adminState.users, (value, key) => {
      const {email, role, verifiedEmail} = value;
      return {
        key,
        email,
        role,
        verifiedEmail,
        name: `${value.firstName} ${value.lastName}`,
      }
    })
  );
  const isLoading = useSelector(selectIsLoading);

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  useEffect(() => {
    if (adminState.staleData || adminState.users) {
      dispatch(fetchUsers.request());
    }
  }, []);

  return (
    <div>
      <PageContent>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: "20px",
          }}
          title="Manage Users"
          subTitle="View and manage registered users"
          onBack={goTo(PATHS.AdminDashboard)}
        />

      </PageContent>
      <Row type="flex" justify="center">
        <Col xs={22} sm={22} md={20} lg={20} xl={16}>
          <Table
            bordered={false}
            columns={columns}
            dataSource={tableData}
            loading={isLoading}
            size="middle"
          />
        </Col>
      </Row>
    </div>
  )
}
