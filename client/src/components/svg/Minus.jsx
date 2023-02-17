import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32.049}
      height={32.049}
      viewBox="0 0 32.049 32.049"
      {...props}>
      <path data-name="Path 11" d="M0 0h32.049v32.049H0z" fill="none" />
      <path
        data-name="Path 12"
        d="M16.025 2.137c-7.666 0-13.888 6.944-13.888 14.422a14.135 14.135 0 0013.888 14.422 14.135 14.135 0 0013.888-14.422c0-7.478-6.222-14.422-13.888-14.422zm6.944 16.024H9.081v-3.2h13.888z"
        fill={props.change ? "#ffd73f" : "grey"}
      />
    </svg>
  );
}

export default SvgComponent;
