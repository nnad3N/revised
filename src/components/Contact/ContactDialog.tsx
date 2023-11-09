import TextInput from "@/components/TextInput";
import { cn, getUrlState, setUrlState, lockScroll } from "@/utils";
import { As, Dialog, Toast, toaster } from "@kobalte/core";
import {
  createForm,
  email,
  required,
  minLength,
  type SubmitHandler,
  reset,
} from "@modular-forms/solid";
import { ArrowUpRightIcon, XMarkIcon } from "@/components/svg/icons";
import { createSignal, onMount, type Component } from "solid-js";
import { Portal } from "solid-js/web";

export type ContactForm = {
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

  const toggleDialog = (isOpen: boolean) => {
    lockScroll(isOpen);
    setIsOpen(isOpen);
    setUrlState({
      contactForm: isOpen ? "open" : undefined,
    });
  };

  onMount(() => {
    toaster.show((props) => (
      <ToastComponent
        toastId={props.toastId}
        title="Dzienna ilość wiadomości przekroczona!"
        description="Limit resetuje się dnia 10/11/2023 o godzinie 19:51."
        status={429}
      />
    ));

    const isDefaultOpen = getUrlState("contactForm") === "open";

    if (isDefaultOpen) {
      lockScroll(true);
      setIsOpen(true);
      setButtonFocus("message");
    }
  });

  return (
    <>
      <Dialog.Root
        modal={false}
        open={isOpen()}
        onOpenChange={(isOpen) => {
          toggleDialog(isOpen);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay class="fixed inset-0 z-20 bg-neutral-700/5 backdrop-blur-sm ui-expanded:animate-fade-in ui-not-expanded:animate-fade-out" />
          <div class="fixed inset-0 z-20 flex items-center justify-center px-4">
            <ContactForm toggleDialog={toggleDialog} />
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
      <Portal>
        <Toast.Region
          duration={10000}
          limit={1}
          aria-label="Powiadomienie (alt+T)"
        >
          <Toast.List />
        </Toast.Region>
      </Portal>
    </>
  );
};

export default ContactDialog;

const wait = () => new Promise((resolve) => setTimeout(resolve, 2000));

interface ContactFormProps {
  toggleDialog: (isOpen: boolean) => void;
}

const ContactForm: Component<ContactFormProps> = (props) => {
  const [contactForm, { Form, Field }] = createForm<ContactForm>();
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [statusCode, setStatusCode] = createSignal(null);

  const handleSubmit: SubmitHandler<ContactForm> = async (values) => {
    if (isSubmitting()) return;

    setIsSubmitting(true);

    console.log(values);
    // const { status } = await fetch("/api/contact", {
    //   method: "POST",
    //   body: JSON.stringify(values),
    // });
    const status = 200;
    await wait();
    props.toggleDialog(false);
    setIsSubmitting(false);
    if (status === 200) {
      toaster.show((props) => (
        <ToastComponent
          toastId={props.toastId}
          title="Wiadomość została wysłana!"
          description="Odpowiemy na nią jak najszybciej."
          status={status}
        />
      ));
      return;
    }

    if (status >= 400) {
      toaster.show((props) => (
        <ToastComponent
          toastId={props.toastId}
          title="Nie udało się wysłać wiadomości."
          description="Spróbuj ponownie później."
          status={status}
        />
      ));
      return;
    }

    if (status === 429) {
      //do the date thingy
      toaster.show((props) => (
        <ToastComponent
          toastId={props.toastId}
          title="Dzienna ilość wiadomości przekroczona!"
          description="Limit resetuje się dnia 09/11/2023 o godzinie 19:51."
          status={status}
        />
      ));
    }
  };

  return (
    <Dialog.Content
      asChild
      class="ui-expanded:animate-fade-in-from-bottom ui-not-expanded:animate-fade-out-to-bottom mx-auto flex w-full max-w-md transform flex-col gap-y-1 rounded-2xl bg-neutral-100 p-4 shadow-xl ring-1 ring-neutral-900/5 focus:outline-none lg:p-6"
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
                value={field.value ?? ""}
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
                value={field.value ?? ""}
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
                value={field.value ?? ""}
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
          <Dialog.CloseButton class="ml-0.5 font-medium transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary">
            Anuluj
          </Dialog.CloseButton>
          <button
            class="flex items-center justify-center gap-x-2.5 rounded-full bg-accent px-5 py-2 text-white transition-colors hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            type="submit"
            aria-disabled={contactForm.invalid || isSubmitting()}
          >
            {isSubmitting() ? (
              <>
                <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Wysyłanie...
              </>
            ) : (
              "Wyślij"
            )}
          </button>
        </div>
      </As>
    </Dialog.Content>
  );
};

interface ToastProps {
  toastId: number;
  title: string;
  description: string;
  status: number;
}

const ToastComponent: Component<ToastProps> = (props) => {
  return (
    <Toast.Root
      toastId={props.toastId}
      class={cn(
        "ui-opened:animate-fade-in-from-right ui-swipe-end:animate-swipe-out ui-closed:animate-fade-out-to-right fixed bottom-4 right-4 z-30 max-w-[calc(100vw-2rem)] rounded-xl bg-neutral-100 p-4 shadow-2xl ring-1 ring-neutral-900/10 focus-visible:outline-none ui-swipe-move:translate-x-[var(--kb-toast-swipe-move-x)] ui-swipe-cancel:translate-x-0 ui-swipe-cancel:transition-transform ui-swipe-cancel:duration-200 sm:bottom-8 sm:right-8",
        props.status === 200
          ? "focus-visible:outline-accent"
          : "focus-visible:outline-red-600",
      )}
    >
      <div class="flex items-start justify-between gap-x-4">
        <div>
          <Toast.Title class="mb-1 font-semibold leading-4">
            {props.title}
          </Toast.Title>
          <Toast.Description class="text-sm leading-4">
            {props.description}
          </Toast.Description>
        </div>
        <Toast.CloseButton
          aria-label="Zamknij powiadomienie"
          class={cn(
            "-translate-y-1 translate-x-1 transition-colors focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2",
            props.status === 200 ? "hover:text-accent" : "hover:text-red-600",
          )}
        >
          <XMarkIcon class="h-6 w-6" />
        </Toast.CloseButton>
      </div>
      <Toast.ProgressTrack class="mt-2 h-1 w-full rounded-full">
        <Toast.ProgressFill
          class={cn(
            "rounded-fulltransition-[width] h-full w-[var(--kb-toast-progress-fill-width)] duration-200 ease-linear",
            props.status === 200 ? "bg-accent" : "bg-red-600",
          )}
        />
      </Toast.ProgressTrack>
    </Toast.Root>
  );
};
