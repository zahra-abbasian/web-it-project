import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={65}
      height={65}
      viewBox="0 0 69.868 69.868"
      color="#d3d3d3"
      {...props}
    >
      <path data-name="Path 23" d="M0 0h69.868v69.868H0z" fill="none" />
      <path
        data-name="Path 24"
        d="M34.934 31.731a3.2 3.2 0 103.2 3.2 3.193 3.193 0 00-3.2-3.2zm0-25.909a29.112 29.112 0 1029.111 29.112A29.122 29.122 0 0034.934 5.822zm6.375 35.487L17.467 52.401l11.091-23.843 23.843-11.091z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SvgComponent;
