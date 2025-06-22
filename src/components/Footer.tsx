import React from 'react';
import logo from '../logo_2.png';

export const Footer: React.FC = () => (
  <footer className="w-full mt-20 py-8 border-t border-slate-200 bg-white/70 backdrop-blur-md text-center text-sm text-slate-600 flex flex-col items-center space-y-3">
    <img src={logo} alt="BillWise logo" style={{ height: 24, width: 'auto' }} />
    <p>
      © 2024 <strong>BillWise</strong> &nbsp;—&nbsp; Splitting bills, not friendships! 💸✨
    </p>
    <p>Designed and built by Manthan</p>
  </footer>
);
