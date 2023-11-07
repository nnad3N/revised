import TextInput from "@/components/TextInput";
import { cn, getUrlState, setUrlState, lockScroll } from "@/utils";
import { As, Dialog } from "@kobalte/core";
import {
  createForm,
  email,
  required,
  minLength,
  type SubmitHandler,
} from "@modular-forms/solid";
import { ArrowUpRightIcon } from "@/components/svg/icons";
import { createSignal, onMount } from "solid-js";

type ContactForm = {
  email: string;
  name: string;
  message: string;
  honeypot: string | undefined;
};

const ContactDialog = () => {
  const [buttonFocus, setButtonFocus] = createSignal<"meeting" | "message">(
    "meeting",
  );
  const [buttonHover, setButtonHover] = createSignal<
    "meeting" | "message" | null
  >(null);
  const [isOpen, setIsOpen] = createSignal(false);

  onMount(() => {
    const isDefaultOpen = getUrlState("contactForm") === "open";

    if (isDefaultOpen) {
      lockScroll(true);
      setIsOpen(true);
      setButtonFocus("message");
    }
  });

  return (
    <Dialog.Root
      modal={false}
      open={isOpen()}
      onOpenChange={(isOpen) => {
        lockScroll(isOpen);
        setUrlState({
          contactForm: isOpen ? "open" : undefined,
        });
        setIsOpen(isOpen);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay class="ui-expanded:animate-fade-in ui-not-expanded:animate-fade-out fixed inset-0 z-20 bg-neutral-700/5 backdrop-blur-sm" />
        <div class="fixed inset-0 z-20 flex items-center justify-center px-4">
          <ContactForm />
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
          href="https://app.zencal.io/u/revised/first-project-meeting?lang=pl"
          target="_blank"
          class={cn(
            "z-10 flex w-1/2 items-center justify-center gap-x-2 rounded-l-full border-2 border-r-0 border-accent px-4 py-3 transition-[color,opacity] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-200 sm:px-6 sm:py-4",
            buttonFocus() === "meeting" ? "text-white" : "text-neutral-200",
            buttonHover() === "message" && "pointer-fine:opacity-50",
          )}
        >
          Umów spotkanie
          <ArrowUpRightIcon class="hidden h-5 w-5 stroke-[0.35] sm:block sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
        </a>
        <Dialog.Trigger
          onMouseEnter={() => setButtonHover("message")}
          onPointerEnter={() => setButtonFocus("message")}
          onFocusIn={() => setButtonFocus("message")}
          class={cn(
            "z-10 w-1/2 rounded-r-full border-2 border-l-0 border-accent px-4 py-3 transition-[color,opacity] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-200 sm:px-6 sm:py-4",
            buttonFocus() === "message" ? "text-white" : "text-neutral-200",
            buttonHover() === "meeting" && "pointer-fine:opacity-50",
          )}
        >
          Wyślij wiadomość
        </Dialog.Trigger>
        <span
          class={cn(
            "absolute left-0 top-0 block h-full w-1/2 rounded-l-full bg-accent transition-all duration-300",
            buttonFocus() === "message" &&
              "translate-x-full rounded-l-none rounded-r-full",
          )}
        />
      </div>
    </Dialog.Root>
  );
};

export default ContactDialog;

const ContactForm = () => {
  const [contactForm, { Form, Field }] = createForm<ContactForm>();

  const handleSubmit: SubmitHandler<ContactForm> = (values) => {
    console.log(values);
  };

  return (
    <Dialog.Content
      asChild
      class="ui-expanded:animate-fade-in-with-transform ui-not-expanded:animate-fade-out-with-transform mx-auto flex w-full max-w-md transform flex-col gap-y-1 rounded-2xl bg-neutral-100 p-4 shadow-xl ring-1 ring-neutral-900/5 focus:outline-none lg:p-6"
    >
      <As component={Form} onSubmit={handleSubmit}>
        <div class="flex flex-col gap-y-3">
          <Field name="name" validate={[required("Podaj swoje imię")]}>
            {(field, props) => (
              <TextInput
                {...props}
                type="text"
                label="Imię:"
                placeholder="Ania"
                value={field.value}
                error={field.error}
                required
                autocomplete="off"
              />
            )}
          </Field>
          <Field
            name="email"
            validate={[
              required("Podaj swój email"),
              email("Zły format adresu email"),
            ]}
          >
            {(field, props) => (
              <TextInput
                {...props}
                type="email"
                label="Email:"
                placeholder="ania@gmail.com"
                value={field.value}
                error={field.error}
                required
              />
            )}
          </Field>
          <Field
            name="message"
            validate={[
              required("Napisz swoją wiadomość"),
              minLength(16, "Wiadomość jest zbyt krótka"),
            ]}
          >
            {(field, props) => (
              <TextInput
                {...props}
                label="Wiadomość:"
                value={field.value}
                error={field.error}
                multiline
                required
                autocomplete="off"
              />
            )}
          </Field>
          <Field name="honeypot">
            {(field, props) => (
              <div class="hidden">
                <label>Nie wypełniaj tego pola jeśli jesteś człowiekiem:</label>
                <input {...props} value={field.value} />
              </div>
            )}
          </Field>
        </div>
        <div class="mt-2 flex items-center justify-between text-sm lg:mt-5 lg:text-base">
          <Dialog.CloseButton class="ml-0.5 rounded-xs font-medium transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary">
            Anuluj
          </Dialog.CloseButton>
          <button
            class="rounded-full bg-accent px-5 py-2 text-white transition-colors hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            type="submit"
            aria-disabled={contactForm.invalid}
          >
            Wyślij
          </button>
        </div>
      </As>
    </Dialog.Content>
  );
};
