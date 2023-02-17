import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 25}
      height={props.size || 25}
      viewBox="0 0 24.442 26.088"
      {...props}
    >
      <path
        data-name="Path 1"
        d="M0 6.83h19.259v19.259H0z"
        fill="rgba(0,0,0,0)"
      />
      <path
        data-name="Path 2"
        d="M12.2 8.569H9.752V0H7.307v8.569H4.855V0H2.407v8.569a4.879 4.879 0 004.591 4.86v11.054h3.06V13.429a4.879 4.879 0 004.591-4.86V0H12.2zM18.321 4.9v9.79h3.06v9.793h3.06V0c-3.378 0-6.12 2.742-6.12 4.9z"
      />
    </svg>
  );
}

export default SvgComponent;
