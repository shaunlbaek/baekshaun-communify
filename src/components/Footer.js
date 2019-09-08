import React from "react";
import "./Footer.scss";
import { FaRegCopyright } from "react-icons/fa";

function Footer() {
  return (
    <div className="Footer">
      <FaRegCopyright style={{ fontSize: 13 }} />
      Copyright 2019
    </div>
  );
}

export default Footer;
