import { XMarkIcon, MenuIcon } from "@/components/svg/icons";
import { hideScroll } from "@/utils";
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
  {
    name: "Kontakt",
    href: "#contact",
  },
];

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleDialog = (isOpen: boolean) => {
    hideScroll(isOpen);
    setIsOpen(isOpen);
  };

  return (
    <Dialog.Root open={isOpen()} onOpenChange={toggleDialog}>
      <Dialog.Trigger
        aria-label="Otwórz menu nawigacji"
        class="h-8 w-8 text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:outline-primary pointer-fine:transition-colors pointer-fine:hover:text-accent lg:hidden"
      >
        <MenuIcon class="h-8 w-8" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-neutral-700/5 backdrop-blur-sm ui-expanded:animate-fade-in ui-not-expanded:animate-fade-out" />
        <div class="fixed inset-0 top-8 px-4">
          <Dialog.Content class="relative mx-auto flex w-full max-w-sm flex-col gap-y-1 rounded-2xl bg-neutral-100 p-3 shadow-xl ring-1 ring-neutral-900/5 focus:outline-none ui-expanded:animate-fade-in-from-bottom ui-not-expanded:animate-fade-out-to-bottom">
            <Dialog.CloseButton
              aria-label="Zamknij menu nawigacji"
              class="absolute right-3 top-[0.8rem] p-1 pointer-fine:transition-colors pointer-fine:hover:text-accent"
            >
              <XMarkIcon class="h-7 w-7" />
            </Dialog.CloseButton>
            <For each={navLinks}>
              {({ name, href }) => (
                <a
                  onClick={() => toggleDialog(false)}
                  class="w-1/4 p-2 text-lg focus-visible:rounded-sm focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:outline-accent pointer-fine:hover:text-accent"
                  href={href}
                >
                  {name}
                </a>
              )}
            </For>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MobileNavigation;
