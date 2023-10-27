import { cn } from "@/utils";
import type { Component } from "solid-js";

type FillOptions = "light" | "dark" | "accent";

interface Props {
  bodyFill?: FillOptions;
  dotFill?: FillOptions;
  class: string;
}

const getFillStyle = (fillOption: FillOptions) => {
  if (fillOption === "light") return "fill-neutral-100";
  if (fillOption === "accent") return "fill-accent";
  return "fill-primary";
};

const Logo: Component<Props> = (props) => {
  return (
    <svg
      class={cn(
        getFillStyle(props.bodyFill ?? "dark"),
        `[&>circle]:${getFillStyle(props.dotFill ?? "dark")}`,
        props.class,
      )}
      viewBox="0 0 101 101"
      aria-hidden="true"
    >
      <g transform="matrix(1,0,0,1,-542,-115)">
        <g transform="matrix(1,0,0,1,-2.71267,-147.388)">
          <g transform="matrix(1.36095,0,0,1.36095,273.978,-305.007)">
            <circle cx="245.143" cy="463.329" r="9.185" />
          </g>
          <g transform="matrix(1,0,0,1,524.139,-139.618)">
            <path d="M108.466,402.68C115.365,402.68 120.966,408.281 120.966,415.18C120.966,422.079 115.365,427.68 108.466,427.68L64.716,427.689C54.361,427.689 45.966,436.084 45.966,446.439L45.966,502.68L20.966,502.68L20.966,446.43C20.966,422.268 40.554,402.68 64.716,402.68L108.466,402.68Z" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Logo;
