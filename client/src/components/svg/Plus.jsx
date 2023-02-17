import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28.206}
      height={28.206}
      viewBox="0 0 28.206 28.206"
      {...props}>
      <path
        data-name="Path 10"
        d="M14.1 0a14.1 14.1 0 1014.1 14.1A14.108 14.108 0 0014.1 0zm7.052 15.513h-5.639v5.641h-2.82v-5.641H7.052v-2.82h5.641V7.052h2.821v5.641h5.641z"
        fill={props.change ? "#ffd73f" : "grey"}
      />
    </svg>
  );
}

export default SvgComponent;
