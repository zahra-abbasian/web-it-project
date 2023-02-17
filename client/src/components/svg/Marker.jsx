import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={29.576}
      height={33.77}
      viewBox="0 0 29.576 33.77"
      {...props}
    >
      <path data-name="Path 2" d="M0 0h29.576v33.77H0z" fill="none" />
      <path
        data-name="Path 3"
        d="M14.788 1.256c-6.44 0-11.648 4.892-11.648 10.94 0 8.205 11.648 20.318 11.648 20.318S26.44 20.402 26.44 12.196c0-6.048-5.212-10.94-11.652-10.94zm0 14.848a4.041 4.041 0 01-4.16-3.907 4.041 4.041 0 014.16-3.907 4.041 4.041 0 014.16 3.907 4.041 4.041 0 01-4.16 3.907z"
      />
    </svg>
  );
}

export default SvgComponent;
