import React from "react";
import logo from "../logo_2.png";

export const Footer: React.FC = () => (
  <footer className="w-full mt-12 py-4 text-center text-sm text-white bg-charcoal flex flex-col md:flex-row items-center justify-center gap-2 space-y-0 md:space-y-0">
    <img src={logo} alt="BillWise logo" style={{ height: 24, width: "auto" }} />
    <p>
      © 2024 <strong>BillWise</strong> &nbsp;—&nbsp; Splitting bills, not
      friendships! 💸✨
    </p>
    <p className="text-saffron hover:text-sandy transition-colors">Designed and built by Manthan</p>
  </footer>
);
