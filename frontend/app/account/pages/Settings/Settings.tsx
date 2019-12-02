import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Descriptions, Icon, PageHeader, Spin, Popconfirm, Typography} from 'antd';

import {useInjectReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {selectIsLoading} from 'reducers';
import PageContent from 'components/PageContent';

import reducer, {selectUser} from 'security/reducer';
import saga from 'security/sagas/login';

import './style.scss';

const key = 'security';
const { Text } = Typography;

export default function Settings() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const user = useSelector(selectUser);

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [changes, setChanges] = useState(false);
  const revertChanges = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setChanges(false);
  };
  const editable = (val, setVal) => editing && {
    onChange: (newVal) => {
      setVal(newVal);
      if (newVal !== val && !changes) setChanges(true);
    }
  };

  const saveChanges = () => {
    const payload = {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
      userID: user.userID,
    };
    console.log('beep, updating according to: ' + JSON.stringify(payload));
    // dispatch(updateUser.request(payload));
    // Reset all values
    setEditing(false);
    setFirstName(null);
    setLastName(null);
    setChanges(false);
  };

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: "20px",
          }}
          title="Account Settings"
          subTitle="Manage your account information"
        />
        <span className="ant-descriptions-title">User Info</span>
        {(editing && changes) ? <Button type="primary" onClick={() => saveChanges()}>
          Save
        </Button> : <Button type={editing ? "primary" : "ghost"} onClick={() => setEditing(!editing)}>
          {!editing ? "Edit" : "View Only"}
        </Button>}
        {editing && changes && <Button type="ghost" onClick={revertChanges} style={{marginLeft: "8px"}}>
          Revert Changes
        </Button>}
        <Descriptions title="" column={2} bordered style={{margin: "25px 5px"}}>
          <Descriptions.Item label="First Name">
            {user && <Text editable={editable(user.firstName, setFirstName)}>
              {(editing && firstName != null) ? firstName : user.firstName}
            </Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {user && <Text editable={editable(user.lastName, setLastName)}>
              {(editing && lastName != null) ? lastName : user.lastName}
            </Text>}
          </Descriptions.Item>
        </Descriptions>
        {/* Hacky method to add a third column while preserving antd css */}
        <span className="ant-descriptions-title">Security Info</span>
        <table className="custom" style={{margin: "25px 5px"}}>
          <tbody>
            <tr>
              <th>Email</th>
              <td className="">{user.email}</td>
              <td><Button type="ghost">Change Email</Button></td>
            </tr>
            <tr>
              <th>Password</th>
              <td>********</td>
              <td><Button type="ghost">Change Password</Button></td>
            </tr>
          </tbody>
        </table>
        <Popconfirm
          title="Are you sure delete your account? This cannot be undone."
          placement="bottom"
          onConfirm={() => console.log('delete delete')}
          onCancel={() => null}
          okText="Yes"
          okType="danger"
          cancelText="No"
          icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
        >
          <Button type="danger" style={{marginRight: "8px"}}>Delete Account</Button>
        </Popconfirm>
      </Spin>
    </PageContent>
  );
}
