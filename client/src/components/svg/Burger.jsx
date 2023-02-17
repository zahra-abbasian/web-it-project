import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      height={28}
      viewBox="0 0 463 420"
      {...props}
    >
      <path d="M202.5 1C139.7 9.2 84.7 38.4 45.2 84.5c-12.6 14.7-25.9 34.9-34.4 52.3-7.2 14.6-8.6 19.9-7.4 26.7.8 4.3 5.9 10.3 10.3 12.1 2.7 1.2 39.9 1.4 217.8 1.4 211.6 0 214.6 0 218.4-2 7-3.5 10.7-10.6 9.8-18.7-1.1-10-21.8-46.7-37.1-65.8-8.5-10.5-25.8-27.8-37.1-36.8-26.3-21.2-57.7-37.1-89.7-45.7-22.5-6-32-7.1-60.3-7.5-14.3-.2-29.1 0-33 .5zm58 20.6c23.9 2.9 48.6 10.5 70.9 21.6 14.9 7.5 22.1 11.9 36.3 22.5 26.8 19.9 49 46.7 65.1 78.3l6.3 12.5-207.2.3c-114 .1-207.5 0-207.7-.3-.9-.9 10.9-23.2 17.8-33.8C64.8 87.6 96 60.2 133.5 42c39.4-19.1 82-25.9 127-20.4zM8.3 201c-2.5 1-5.3 5.8-5.3 9 0 3.4 2.9 8 5.6 9 1.6.6 85.9 1 225.4 1h222.8l3.1-2.6c2.7-2.2 3.1-3.2 3.1-7.4s-.4-5.2-3.1-7.4l-3.1-2.6-223.1.1c-127 0-224.1.4-225.4.9zM18.7 244.4c-8.3 3-14.7 9.4-17.5 17.5-1.8 5.1-1.4 17.4.9 31.2C14 363.7 60.8 404.3 143.5 415.9c24.9 3.5 38.6 4.1 90.2 4.1 65.2 0 90-1.9 119.2-9.1 64.7-16 99.7-55.5 108.6-122.7 2.8-21.3 1.5-28.3-6.8-36.7-9.4-9.4 12.9-8.5-223.6-8.5-173 .1-209.2.3-212.4 1.4zm421.5 21.7c3 3 3.1 3.1 2.4 10.7-5.6 66.7-40.5 105.2-106.7 117.6-26.5 5-76.8 7.1-128.9 5.6-33.5-1-45-1.9-65-5.1-54.2-8.6-89.7-30.6-107.9-66.7-8.9-17.7-16.7-52.5-13.5-60.1.7-1.6 2-3.4 3.1-4 1.2-.7 63.3-1 207.6-1.1h205.9l3 3.1z" />
    </svg>
  );
}

export default SvgComponent;