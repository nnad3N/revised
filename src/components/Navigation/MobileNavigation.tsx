import { XIcon, MenuIcon } from "lucide-solid";
import { Dialog } from "@kobalte/core";
import { createSignal } from "solid-js";
import { links } from "./Navigation.astro";

const MobileNavigation = () => {
  const [open, setOpen] = createSignal(false);

  return (
    <Dialog.Root modal={false} open={open()} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={open() ? "Zamknij menu nawigacji" : "Otwórz menu nawigacji"}
        class="relative z-20 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
      >
        {open() ? (
          <XIcon aria-hidden="true" />
        ) : (
          <MenuIcon aria-hidden="true" />
        )}
      </Dialog.Trigger>
      <Dialog.Overlay class="ui-expanded:animate-fadeIn ui-not-expanded:animate-fadeOut fixed inset-0 bg-neutral-700/5 backdrop-blur-sm lg:hidden" />
      <Dialog.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        class="ui-expanded:animate-fadeInWithScale ui-not-expanded:animate-fadeOutWithScale fixed inset-0 top-20 px-4"
      >
        <div class="mx-auto flex w-full max-w-sm transform flex-col gap-y-1 rounded-2xl bg-neutral-100 p-4 shadow-xl ring-1 ring-neutral-900/5 transition-all focus:outline-none">
          {links.map(({ name, href }) => (
            <a class="p-2 text-lg focus-visible:outline-accent" href={href}>
              {name}
            </a>
          ))}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default MobileNavigation;
