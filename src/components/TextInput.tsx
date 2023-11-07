import { TextField as Kobalte } from "@kobalte/core";
import { type JSX, Show, splitProps, type Component } from "solid-js";

interface Props {
  name: string;
  type?: "text" | "email" | "tel" | "password" | "url" | "date" | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  value: string | undefined;
  error: string;
  multiline?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  autocomplete?: "on" | "off" | undefined;
  ref: (element: HTMLInputElement | HTMLTextAreaElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
}

const TextInput: Component<Props> = (props) => {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur", "autocomplete"],
  );
  return (
    <Kobalte.Root
      {...rootProps}
      validationState={props.error ? "invalid" : "valid"}
      class="flex flex-col"
    >
      <Show when={props.label}>
        <Kobalte.Label class="ml-0.5 w-max text-sm font-medium lg:text-base">
          {props.label}
        </Kobalte.Label>
      </Show>
      {props.multiline ? (
        <Kobalte.TextArea
          {...inputProps}
          class="mt-0.5 rounded-md border-2 border-primary/50 bg-transparent px-2 py-1 focus-visible:border-accent focus-visible:!text-primary focus-visible:outline-none ui-not-valid:border-red-600 ui-not-valid:text-red-600"
          autoResize
          rows={4}
        />
      ) : (
        <Kobalte.Input
          {...inputProps}
          class="mt-0.5 rounded-md border-2 border-primary/50 bg-transparent px-2 py-1 focus-visible:border-accent focus-visible:!text-primary focus-visible:outline-none ui-not-valid:border-red-600 ui-not-valid:text-red-600"
          type={props.type}
        />
      )}
      <Kobalte.ErrorMessage class="ml-0.5 mt-1 text-sm font-medium text-red-600">
        {props.error}
      </Kobalte.ErrorMessage>
    </Kobalte.Root>
  );
};

export default TextInput;
