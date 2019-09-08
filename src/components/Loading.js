import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <div className="icon-spin">
        <FaSpinner />
      </div>
      Loading...
    </div>
  );
}
