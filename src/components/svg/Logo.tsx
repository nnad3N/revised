import { cn } from "@/utils";
import type { Component } from "solid-js";

interface Props {
  class: string;
  dotClass?: string;
}

const Logo: Component<Props> = (props) => {
  return (
    <svg class={cn(props.class)} viewBox="0 0 128 128" aria-hidden="true">
      <g id="logo">
        <circle class={props.dotClass} cx="79.768" cy="80.049" r="15.875" />
        <path d="M111.518,0.674c8.762,0 15.875,7.114 15.875,15.875c-0,8.762 -7.113,15.875 -15.875,15.875l-55.563,0.012c-13.151,-0 -23.812,10.661 -23.812,23.812l-0,71.426l-31.75,0l-0,-71.437c-0,-30.687 24.876,-55.563 55.562,-55.563l55.563,0Z" />
      </g>
    </svg>
  );
};

export default Logo;
