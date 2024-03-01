import Logo from "@/components/svg/Logo";
import { onMount } from "solid-js";

const Footer = () => {
  let emailElement: HTMLSpanElement | undefined;

  onMount(() => {
    const email = atob(emailElement?.getAttribute("data-encoded") ?? "");

    if (emailElement) {
      emailElement.innerText = email;
      emailElement.removeAttribute("data-encoded");
    }
  });

  return (
    <footer class="bg-primary px-4 sm:px-8">
      <div class="mx-auto flex max-w-sm flex-wrap-reverse items-center justify-between gap-4 border-t-2 border-neutral-200/20 py-10 text-sm sm:max-w-7xl sm:text-base">
        <div class="flex items-center gap-x-2 sm:gap-x-4">
          <a href="/" aria-label="Strona Główna">
            <Logo class="h-5 w-5 fill-neutral-200 sm:h-6 sm:w-6" />
          </a>
          <div class="block h-5 w-0.5 bg-neutral-200 sm:h-6" />
          <span
            ref={emailElement}
            class="text-neutral-200"
            data-encoded="a29udGFrdEByZXZpc2VkLnBs"
          />
        </div>
        <a
          class="text-neutral-200 transition-colors hover:text-neutral-300"
          href="/privacy-policy/"
        >
          Polityka Prywatności
        </a>
      </div>
    </footer>
  );
};

export default Footer;
