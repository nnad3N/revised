import type { Component, JSX } from "solid-js";

const ArrowUpRightIcon: Component<JSX.SvgSVGAttributes<SVGSVGElement>> = (
  props,
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      stroke="currentColor"
      stroke-width={0}
      aria-hidden="true"
      {...props}
    >
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06l7.22 7.22H6.75a.75.75 0 000 1.5h7.5a.747.747 0 00.75-.75v-7.5a.75.75 0 00-1.5 0v5.69L6.28 5.22z" />
    </svg>
  );
};

export default ArrowUpRightIcon;
