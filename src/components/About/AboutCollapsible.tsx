import { Collapsible } from "@kobalte/core";
import { ArrowDownRightIcon, ArrowUpLeftIcon } from "@/components/svg/icons";
import { onMount, createSignal, type Component } from "solid-js";
import { cn, getUrlState, setUrlState } from "@/utils.ts";

const AboutDropdown = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [isAfterOpen, setIsAfterOpen] = createSignal(false);

  let collapsibleRef!: HTMLDivElement;

  onMount(() => {
    const isDefaultOpen = getUrlState("aboutCollapsible") === "open";
    // Setting isAfterOpen as the default state to skip the animation
    setIsAfterOpen(isDefaultOpen);
    setIsOpen(isDefaultOpen);
  });

  const onOpenChange = (isOpen: boolean) => {
    setIsAnimating(true);
    setIsOpen(isOpen);
    setUrlState({
      aboutCollapsible: isOpen ? "open" : undefined,
    });
    setTimeout(() => {
      setIsAnimating(false);
      setIsAfterOpen(isOpen);
    }, 500);
  };

  return (
    <Collapsible.Root
      ref={collapsibleRef}
      defaultOpen={isAfterOpen()}
      open={isOpen()}
      onOpenChange={onOpenChange}
    >
      <p>
        Nihil aspernatur error, culpa est praesentium voluptates, rerum saepe
        corporis quibusdam asperiores temporibus inventore. Et eveniet est
        tempora, magni quo dolor.
      </p>
      <Collapsible.Content class="ui-expanded:animate-slide-down ui-not-expanded:animate-slide-up mt-2 space-y-2 overflow-hidden">
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
        class={cn(
          isAnimating() && "pointer-events-none cursor-pointer",
          "group mt-2 flex items-center gap-x-1.5 font-semibold transition-colors hover:text-primary/90 focus-visible:rounded-xs focus-visible:outline-none focus-visible:outline-offset-3 focus-visible:outline-primary lg:text-lg",
        )}
        aria-disabled={isAnimating()}
      >
        {isOpen() ? "Mniej" : "Więcej"}
        <CollapsibleArrow
          isOpen={isOpen}
          isAfterOpen={isAfterOpen}
          class={cn(
            "h-6 w-6 stroke-[0.35] transition-transform pointer-fine:group-hover:rotate-45",
            // Remember to change the setTimeout duration
            isAnimating() ? "duration-[550ms]" : "duration-300",
          )}
        />
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
};

export default AboutDropdown;

interface CollapsibleArrowProps {
  isOpen: () => boolean;
  isAfterOpen: () => boolean;
  class: string;
}

const CollapsibleArrow: Component<CollapsibleArrowProps> = (props) => {
  return (
    <>
      {props.isAfterOpen() ? (
        <ArrowUpLeftIcon
          class={cn(props.class, !props.isOpen() && "rotate-180")}
        />
      ) : (
        <ArrowDownRightIcon
          class={cn(props.class, props.isOpen() && "rotate-180")}
        />
      )}
    </>
  );
};
