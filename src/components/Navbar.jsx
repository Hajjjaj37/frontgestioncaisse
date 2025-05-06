import React from 'react';

const navbarStyle = {
  width: '100%',
  height: '64px',
  background: '#f7f9fa',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 32px',
  borderBottom: '1px solid #e0e0e0',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const leftStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const rightStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const iconCircle = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  background: '#e5e8eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  color: '#222b3a',
  cursor: 'pointer',
};

const Navbar = () => (
  <div style={navbarStyle}>
    <div style={leftStyle}>
      <div style={iconCircle}>
        <span style={{ fontSize: '1.5rem' }}>&#9776;</span>
      </div>
    </div>
    <div style={rightStyle}>
      <div style={iconCircle}>
        <span role="img" aria-label="settings">⚙️</span>
      </div>
      <div style={iconCircle}>
        <span role="img" aria-label="notifications">🔔</span>
      </div>
      <div style={iconCircle}></div>
    </div>
  </div>
);

export default Navbar; 