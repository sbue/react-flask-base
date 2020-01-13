import React from 'react';
import {useSelector} from 'react-redux';
import {Col, Row, Tag, Menu, Icon} from 'antd';

import {SITE_NAME, PATHS} from 'config';
import {selectIsAuthenticated, selectIsAdmin} from 'account/reducer';
import A from 'components/A';

import icon from 'assets/images/icon-512x512.png';
import './style.scss';


export default function Header() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  return (
    <div id="header">
      <Menu mode="horizontal"
            onSelect={() => null}
            overflowedIndicator={<Icon type="menu" style={{fontSize: "20px"}} />}>
        <Menu.Item key="home">
          <A route={PATHS.Home} className="menu-item-logo">
            <img src={icon} height="32px" style={{}} />
            <h5>{SITE_NAME}</h5>
          </A>
        </Menu.Item>
        {isAuthenticated && isAdmin && <Menu.Item key="admin-badge" className="right-menu">
          <Tag color="purple">Admin</Tag>
        </Menu.Item>}
        {isAuthenticated && <Menu.Item key="logout" className="right-menu">
          <A route={PATHS.Logout}>Logout</A>
        </Menu.Item>}
        {isAuthenticated && <Menu.Item key="settings" className="right-menu">
          <A route={PATHS.Settings}>Settings</A>
        </Menu.Item>}
        {isAuthenticated && isAdmin && <Menu.Item key="admin-dashboard" className="right-menu">
          <A route={PATHS.AdminDashboard}>Dashboard</A>
        </Menu.Item>}
        {!isAuthenticated && <Menu.Item key="sign-up" className="right-menu">
          <A route={PATHS.SignUp}>Sign Up</A>
        </Menu.Item>}
        {!isAuthenticated && <Menu.Item key="login" className="right-menu">
          <A route={PATHS.Login}>Login</A>
        </Menu.Item>}
      </Menu>
    </div>
  );
}
