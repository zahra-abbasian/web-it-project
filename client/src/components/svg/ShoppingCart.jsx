import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : 60}
      height={props.height ? props.height : 60}
      viewBox="0 0 115 115"
      {...props}
    >
      <circle
        data-name="Ellipse 2"
        cx={57.5}
        cy={57.5}
        r={57.5}
        fill={props.fill || "#132327"}
      />
      <path
        data-name="Path 3"
        d="M21.857 20.4h72.858v72.858H21.857z"
        fill="none"
      />
      <path
        data-name="Path 4"
        d="M43.107 75.043a6.071 6.071 0 106.071 6.071 6.063 6.063 0 00-6.071-6.071zM24.893 26.471v6.071h6.071l10.929 23.042-4.1 7.437a5.869 5.869 0 00-.759 2.914 6.089 6.089 0 006.071 6.071h36.431v-6.07H44.382a.752.752 0 01-.759-.759l.091-.364 2.732-4.948h22.617a6.043 6.043 0 005.313-3.127l10.868-19.7a2.966 2.966 0 00.364-1.457 3.045 3.045 0 00-3.036-3.036H37.673l-2.853-6.074h-9.927zm48.572 48.572a6.071 6.071 0 106.071 6.071 6.063 6.063 0 00-6.071-6.071z"
        fill="#fff"
      />
    </svg>
  );
}

export default SvgComponent;
