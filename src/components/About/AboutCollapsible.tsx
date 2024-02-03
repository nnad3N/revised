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
        Jesteśmy przekonani, że strony internetowe powinny być szybkie,
        bezpieczne i&nbsp;dostosowane dla osób niepełnosprawnych, niezależnie od
        ceny. Dzięki nowoczesnym technologiom oraz naszemu doświadczeniu
        tworzymy strony na najwyższym poziomie.
      </p>
      <Collapsible.Content class="mt-2 space-y-2 overflow-hidden ui-expanded:animate-slide-down ui-not-expanded:animate-slide-up">
        <p>
          Tworzymy strony w oparciu o Serverless i&nbsp;Edge Runtime. Dzięki
          takiemu podejściu koszta usługi skalują się wraz ze wzrostem
          użytkowników, a strona zawsze działa szybko. Jesteśmy zwolennikami
          rozwoju rozwiązań typu Headless, które pozwalają na odłączenie logiki
          strony od aplikacji np. systemu CMS.
        </p>
        <p>
          Rozwiązania low-code lub no-code spełniają większość podstawowych
          wymagań, lecz gdy chcemy czegoś więcej pojawiają się liczne problemy
          uniemożliwiające integrację nowych funkcji. Nasze strony są
          projektowane, by mogły zostać w każdej chwili rozszerzone o dowolne
          funkcje, ponieważ nie używamy żadnych szablonów.
        </p>
      </Collapsible.Content>
      <Collapsible.Trigger
        class={cn(
          isAnimating() && "pointer-events-none cursor-pointer",
          "group mt-2 flex items-center gap-x-1.5 font-semibold transition-colors hover:text-primary/90 focus-visible:rounded-sm focus-visible:outline-none focus-visible:outline-offset-3 focus-visible:outline-primary lg:text-lg",
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
