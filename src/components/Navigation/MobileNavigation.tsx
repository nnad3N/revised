import { XMarkIcon, MenuIcon } from "@/components/svg/icons";
import { lockScroll } from "@/utils";
import { Dialog } from "@kobalte/core";
import { For, createSignal } from "solid-js";

export const navLinks = [
  {
    name: "O Nas",
    href: "#about",
  },
  {
    name: "Usługi",
    href: "#services",
  },
  {
    name: "Projekty",
    href: "#projects",
  },
];

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleDialog = (isOpen: boolean) => {
    lockScroll(isOpen);
    setIsOpen(isOpen);
  };

  return (
    <Dialog.Root modal={false} open={isOpen()} onOpenChange={toggleDialog}>
      <Dialog.Trigger
        aria-label={
          isOpen() ? "Zamknij menu nawigacji" : "Otwórz menu nawigacji"
        }
        class="relative z-20 h-8 w-8 text-primary focus-visible:rounded-xs focus-visible:outline-none focus-visible:outline-primary lg:hidden"
      >
        {isOpen() ? (
          <XMarkIcon class="mx-auto h-7 w-7" />
        ) : (
          <MenuIcon class="h-8 w-8" />
        )}
      </Dialog.Trigger>
      <Dialog.Overlay class="ui-expanded:animate-fade-in ui-not-expanded:animate-fade-out fixed inset-0 bg-neutral-700/5 backdrop-blur-sm lg:hidden" />
      <Dialog.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        class="ui-expanded:animate-fade-in-with-transform ui-not-expanded:animate-fade-out-with-transform !pointer-events-none fixed inset-0 top-20 h-max px-4"
      >
        <div class="pointer-events-auto mx-auto flex w-full max-w-sm transform flex-col gap-y-1 rounded-2xl bg-neutral-100 p-4 shadow-xl ring-1 ring-neutral-900/5 transition-all focus:outline-none">
          <For each={navLinks}>
            {({ name, href }) => (
              <a
                onClick={() => toggleDialog(false)}
                class="w-max p-2 text-lg focus-visible:rounded-xs focus-visible:outline-none focus-visible:outline-accent"
                href={href}
              >
                {name}
              </a>
            )}
          </For>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default MobileNavigation;
