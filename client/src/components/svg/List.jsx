import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={65}
      height={65}
      viewBox="0 0 75.144 75.144"
      color="#d3d3d3"
      {...props}
    >
      <path data-name="Path 21" d="M0 0h75.144v75.144H0z" fill="none" />
      <path
        data-name="Path 22"
        d="M59.493 15.655v43.838H15.655V15.655h43.838m3.44-6.262H12.211a2.806 2.806 0 00-2.818 2.818v50.722a3.027 3.027 0 002.818 2.818h50.722a3.321 3.321 0 002.818-2.818V12.211a3.027 3.027 0 00-2.818-2.818zM34.441 21.917h18.786v6.262H34.441zm0 12.524h18.786v6.262H34.441zm0 12.524h18.786v6.262H34.441zM21.917 21.917h6.262v6.262h-6.262zm0 12.524h6.262v6.262h-6.262zm0 12.524h6.262v6.262h-6.262z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SvgComponent;
