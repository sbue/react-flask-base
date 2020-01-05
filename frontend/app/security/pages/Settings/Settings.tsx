import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Descriptions, Icon, PageHeader, Spin, Popconfirm,
  Typography, Upload} from 'antd';

import A from 'components/A';
import {PATHS, SERVER_URL} from 'config';
import {useInjectSecurityReducer} from 'utils/injectReducer';
import {useInjectMultipleSagas} from 'utils/injectSaga';
import {selectIsLoading} from 'site/reducer';
import PageContent from 'components/PageContent/index';

import {changeUserInfo, deleteAccount} from 'security/actions'
import {selectUser} from 'security/reducer';
import changeUserInfoSaga from 'security/sagas/changeUserInfo';
import deleteAccountSaga from 'security/sagas/deleteAccount';

import './style.scss';

const { Text } = Typography;

export default function Settings() {
  useInjectSecurityReducer();
  useInjectMultipleSagas({ key: 'settings', sagas:
      [changeUserInfoSaga, deleteAccountSaga],
  });

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const user = useSelector(selectUser);

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
      if (newVal !== val && !changes) { setChanges(true); }
    },
  };

  const saveChanges = () => {
    dispatch(changeUserInfo.request({firstName, lastName}));
    // Reset all values
    setEditing(false);
    setFirstName(null);
    setLastName(null);
    setChanges(false);
  };

  const uploadButton = (
    <div>
      <Icon type={isLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  const imageUrl = "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png";

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: '20px',
          }}
          title="Account Settings"
          subTitle="Manage your account information"
        >
        </PageHeader>
        <table className="custom" style={{margin: '25px 5px'}}>
          <tbody>
            <tr>
              <th>Profile Photo</th>
              <td colSpan={2}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className={editing ? "" : "avatar-uploader-hide-border" }
                  style={{
                    border: 0,
                  }}
                  disabled={!editing}
                  action={(SERVER_URL + "/upload/")}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              </td>
            </tr>
            <tr>
              <th>First Name</th>
              <td colSpan={2}>
                {user && <Text editable={editable(user.firstName, setFirstName)}>
                  {(editing && firstName != null) ? firstName : user.firstName}
                </Text>}
              </td>
            </tr>
            <tr>
              <th>Last Name</th>
              <td colSpan={2}>
                {user && <Text editable={editable(user.lastName, setLastName)}>
                  {(editing && lastName != null) ? lastName : user.lastName}
                </Text>}
              </td>
            </tr>
            <tr>
              <th>Email</th>
              <td className="">{user.email}</td>
              <td>
                <A route={PATHS.ChangeEmail}>
                  <Button type="ghost">Change Email</Button>
                </A>
              </td>
            </tr>
            <tr>
              <th>Password</th>
              <td>
                <div style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  width: "65%",
                  height: "12px"
                }}><span /></div>
              </td>
              <td>
                <A route={PATHS.ChangePassword}>
                  <Button type="ghost">Change Password</Button>
                </A>
              </td>
            </tr>
          </tbody>
        </table>
        <span>
          {(editing && changes) ? <Button type="primary" onClick={saveChanges}>
            Save
          </Button> : <Button type={editing ? 'ghost' : 'primary'} onClick={() => setEditing(!editing)}>
            {!editing ? 'Edit' : 'View Only'}
          </Button>}
          {editing && changes && <Button type="ghost" onClick={revertChanges} style={{marginLeft: '8px'}}>
            Revert Changes
          </Button>}
        </span>
        <Popconfirm
          title="Are you sure delete your account? This cannot be undone."
          placement="bottom"
          onConfirm={() => dispatch(deleteAccount.request())}
          onCancel={() => null}
          okText="Yes"
          okType="danger"
          cancelText="No"
          icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
        >
          <Button type="danger" style={{marginLeft: '8px'}}>Delete Account</Button>
        </Popconfirm>
      </Spin>
    </PageContent>
  );
}
