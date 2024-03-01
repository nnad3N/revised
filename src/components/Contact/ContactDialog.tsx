import { cn, getUrlState } from "@/utils";
import { Dialog } from "@kobalte/core";
import { ArrowUpRightIcon } from "@/components/svg/icons";
import {
  createSignal,
  onMount,
  type Component,
  type JSXElement,
} from "solid-js";

interface Props {
  isOpen: () => boolean;
  toggleDialog: (isOpen: boolean) => void;
  children: JSXElement;
}

type ButtonType = "meeting" | "contact";

const ContactDialog: Component<Props> = (props) => {
  const [buttonFocus, setButtonFocus] = createSignal<ButtonType>("meeting");
  const [buttonHover, setButtonHover] = createSignal<ButtonType | null>(null);

  onMount(() => {
    const isDefaultOpen = getUrlState("contactForm") === "open";

    if (isDefaultOpen) {
      props.toggleDialog(true);
      setButtonFocus("contact");
    }
  });

  return (
    <Dialog.Root open={props.isOpen()} onOpenChange={props.toggleDialog}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-20 bg-neutral-700/5 backdrop-blur-sm ui-expanded:animate-fade-in ui-not-expanded:animate-fade-out" />
        <div class="fixed inset-0 z-20 flex items-center justify-center px-4">
          {props.children}
        </div>
      </Dialog.Portal>
      <div
        onMouseLeave={() => setButtonHover(null)}
        class="relative flex w-full text-sm font-medium sm:text-base lg:max-w-xl lg:text-lg"
      >
        <a
          onMouseEnter={() => setButtonHover("meeting")}
          onPointerEnter={() => setButtonFocus("meeting")}
          onFocusIn={() => setButtonFocus("meeting")}
          href="https://outlook.office365.com/owa/calendar/spotkania@revised.pl/bookings/"
          target="_blank"
          class={cn(
            "z-10 flex w-1/2 items-center justify-center gap-x-2 rounded-l-full border-2 border-r-0 border-accent px-4 py-3 transition-[color,opacity] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-200 sm:px-6 sm:py-4",
            buttonFocus() === "meeting" ? "text-white" : "text-neutral-200",
            buttonHover() === "contact" && "pointer-fine:opacity-50",
          )}
        >
          Umów spotkanie
          <ArrowUpRightIcon class="hidden h-5 w-5 stroke-[0.35] sm:block sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
        </a>
        <Dialog.Trigger
          onMouseEnter={() => setButtonHover("contact")}
          onPointerEnter={() => setButtonFocus("contact")}
          onFocusIn={() => setButtonFocus("contact")}
          class={cn(
            "z-10 w-1/2 rounded-r-full border-2 border-l-0 border-accent px-4 py-3 transition-[color,opacity] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-200 sm:px-6 sm:py-4",
            buttonFocus() === "contact" ? "text-white" : "text-neutral-200",
            buttonHover() === "meeting" && "pointer-fine:opacity-50",
          )}
        >
          Wyślij wiadomość
        </Dialog.Trigger>
        <span
          class={cn(
            "absolute left-0 top-0 block h-full w-1/2 rounded-l-full bg-accent transition-all duration-300",
            buttonFocus() === "contact" &&
              "translate-x-full rounded-l-none rounded-r-full",
          )}
        />
      </div>
    </Dialog.Root>
  );
};

export default ContactDialog;
