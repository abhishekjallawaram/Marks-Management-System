'use client';

import SideNavbar from './sidebar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <SideNavbar />
      <div style={{ marginLeft: '250px' }}>{children}</div>
    </div>
  );
};

export default Layout;
