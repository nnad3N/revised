import { Collapsible } from "@kobalte/core";
import { makeEventListener } from "@solid-primitives/event-listener";
import { createMediaQuery } from "@solid-primitives/media";
import { ArrowDownRightIcon, ArrowUpLeftIcon } from "lucide-solid";
import { onMount, createSignal, type Component } from "solid-js";
import { cn } from "@/utils.ts";

const AboutDropdown = () => {
  const isMobile = createMediaQuery("(pointer: coarse)", false);
  const [open, setOpen] = createSignal(false);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [isAfterOpen, setIsAfterOpen] = createSignal(false);

  let collapsibleRef!: HTMLDivElement;
  let buttonRef!: HTMLButtonElement;

  onMount(() => {
    makeEventListener(
      collapsibleRef,
      "animationend",
      //eslint-disable-next-line solid/reactivity
      () => {
        setIsAfterOpen(open());
        setIsAnimating(false);
      },
      { passive: true },
    );
  });

  return (
    <Collapsible.Root
      ref={collapsibleRef}
      open={open()}
      onOpenChange={(isOpen) => {
        setIsAnimating(true);
        setOpen(isOpen);
      }}
    >
      <p>
        Nihil aspernatur error, culpa est praesentium voluptates, rerum saepe
        corporis quibusdam asperiores temporibus inventore. Et eveniet est
        tempora, magni quo dolor.
      </p>
      <Collapsible.Content class="mt-2 space-y-2 overflow-hidden ui-expanded:animate-slideDown ui-not-expanded:animate-slideUp">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum, amet?
          Delectus qui soluta adipisci distinctio consectetur tempora molestiae?
          Ab aut velit rem voluptate harum placeat, aliquid nihil? Reprehenderit
          possimus saepe inventore in molestias, quos officia ullam maxime odit
          delectus iusto.
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum, amet?
          Delectus qui soluta adipisci distinctio consectetur tempora molestiae?
          Ab aut velit rem voluptate harum placeat, aliquid nihil? Reprehenderit
          possimus saepe inventore in molestias.
        </p>
      </Collapsible.Content>
      <Collapsible.Trigger
        ref={buttonRef}
        class={cn(
          !isMobile() && "group",
          isAnimating() && "pointer-events-none cursor-pointer",
          "mt-3 flex items-center gap-x-1 font-semibold transition-colors hover:text-primary/90 focus-visible:outline-offset-[3px] focus-visible:outline-primary lg:text-lg",
        )}
        aria-disabled={isAnimating()}
      >
        {open() ? "Mniej" : "Więcej"}
        <CollapsibleArrow
          open={open}
          isAfterOpen={isAfterOpen}
          class={cn(
            !isMobile() && "group-hover:rotate-45",
            "h-6 w-6 transition-transform duration-300",
          )}
        />
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
};

export default AboutDropdown;

interface CollapsibleArrowProps {
  open: () => boolean;
  isAfterOpen: () => boolean;
  class: string;
}

const CollapsibleArrow: Component<CollapsibleArrowProps> = (props) => {
  return (
    <>
      {props.isAfterOpen() ? (
        <ArrowUpLeftIcon
          aria-hidden="true"
          class={cn(props.class, !props.open() && "rotate-180")}
        />
      ) : (
        <ArrowDownRightIcon
          aria-hidden="true"
          class={cn(props.class, props.open() && "rotate-180")}
        />
      )}
    </>
  );
};
