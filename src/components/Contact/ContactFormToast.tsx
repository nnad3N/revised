import { XMarkIcon } from "@/components/svg/icons";
import { cn } from "@/utils";
import { Toast } from "@kobalte/core";
import type { Component } from "solid-js";

interface Props {
  toastId: number;
  title: string;
  description: string;
  error: boolean;
}

const ContactFromToast: Component<Props> = (props) => {
  return (
    <Toast.Root
      toastId={props.toastId}
      class={cn(
        "fixed bottom-4 right-4 z-30 max-w-[calc(100vw-2rem)] rounded-xl bg-neutral-100 p-4 shadow-2xl ring-1 ring-neutral-900/10 focus-visible:outline-none ui-opened:animate-fade-in-from-right ui-closed:animate-fade-out-to-right ui-swipe-move:translate-x-[var(--kb-toast-swipe-move-x)] ui-swipe-cancel:translate-x-0 ui-swipe-cancel:transition-transform ui-swipe-cancel:duration-200 ui-swipe-end:animate-swipe-out sm:bottom-8 sm:right-8",
        props.error
          ? "focus-visible:outline-red-600"
          : "focus-visible:outline-accent",
      )}
    >
      <div class="flex items-start justify-between gap-x-4">
        <div>
          <Toast.Title class="mb-1 font-semibold leading-4">
            {props.title}
          </Toast.Title>
          <Toast.Description class="text-sm leading-4">
            {props.description}
          </Toast.Description>
        </div>
        <Toast.CloseButton
          aria-label="Zamknij powiadomienie"
          class={cn(
            "-translate-y-1 translate-x-1 transition-colors focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2",
            props.error ? "hover:text-red-600" : "hover:text-accent",
          )}
        >
          <XMarkIcon class="h-6 w-6" />
        </Toast.CloseButton>
      </div>
      <Toast.ProgressTrack class="mt-2 h-1 w-full rounded-full">
        <Toast.ProgressFill
          class={cn(
            "rounded-fulltransition-[width] h-full w-[var(--kb-toast-progress-fill-width)] duration-200 ease-linear",
            props.error ? "bg-red-600" : "bg-accent",
          )}
        />
      </Toast.ProgressTrack>
    </Toast.Root>
  );
};

export default ContactFromToast;
