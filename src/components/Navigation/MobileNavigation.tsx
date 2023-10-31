import { XIcon, MenuIcon } from "lucide-solid";
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

  return (
    <Dialog.Root modal={false} open={isOpen()} onOpenChange={setIsOpen}>
      <Dialog.Trigger
        aria-label={
          isOpen() ? "Zamknij menu nawigacji" : "Otwórz menu nawigacji"
        }
        class="relative z-20 text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
      >
        {isOpen() ? (
          <XIcon aria-hidden="true" />
        ) : (
          <MenuIcon aria-hidden="true" />
        )}
      </Dialog.Trigger>
      <Dialog.Overlay class="fixed inset-0 bg-neutral-700/5 backdrop-blur-sm ui-expanded:animate-fadeIn ui-not-expanded:animate-fadeOut lg:hidden" />
      <Dialog.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        class="fixed inset-0 top-20 px-4 ui-expanded:animate-fadeInWithScale ui-not-expanded:animate-fadeOutWithScale"
      >
        <div class="mx-auto flex w-full max-w-sm transform flex-col gap-y-1 rounded-2xl bg-neutral-100 p-4 shadow-xl ring-1 ring-neutral-900/5 transition-all focus:outline-none">
          <For each={navLinks}>
            {({ name, href }) => (
              <a
                onClick={() => setIsOpen(false)}
                class="p-2 text-lg focus-visible:outline-accent"
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
