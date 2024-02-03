import ContactDialog from "@/components/Contact/ContactDialog";
import ContactFormToast from "@/components/Contact/ContactFormToast";
import TextInput from "@/components/TextInput";
import { hideScroll, setUrlState } from "@/utils";
import { toaster, Dialog, As, Toast } from "@kobalte/core";
import {
  type SubmitHandler,
  createForm,
  required,
  email,
  minLength,
  reset,
} from "@modular-forms/solid";
import { createSignal } from "solid-js";
import { Portal } from "solid-js/web";

type ContactForm = {
  email: string;
  name: string;
  message: string;
  privacyPolicy: boolean;
  honeypot: string | undefined;
};

const ContactForm = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [contactForm, { Form, Field }] = createForm<ContactForm>();
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [shouldReset, setShouldReset] = createSignal(false);
  const [toastId, setToastId] = createSignal<number | null>(null);

  const toggleDialog = (isOpen: boolean) => {
    hideScroll(isOpen);
    setIsOpen(isOpen);
    setUrlState({
      contactForm: isOpen ? "open" : undefined,
    });
  };

  const handleSubmit: SubmitHandler<ContactForm> = async (values) => {
    try {
      if (isSubmitting()) return;
      setIsSubmitting(true);

      const [res] = await Promise.allSettled([
        fetch("/api/contact", {
          method: "POST",
          body: JSON.stringify(values),
        }),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);

      setIsSubmitting(false);

      if (toastId() !== null) {
        toaster.dismiss(toastId()!);
      }

      if (res.status === "rejected") {
        throw new Error(
          typeof res.reason === "string"
            ? res.reason
            : "Unexpected fetch error",
        );
      }

      let id: number | null = null;
      const status = res.value.status;

      if (status === 200) {
        setShouldReset(true);
        toggleDialog(false);

        id = toaster.show((props) => (
          <ContactFormToast
            toastId={props.toastId}
            error={false}
            title="Wiadomość wysłana!"
            description="Odpowiemy na nią jak najszybciej."
          />
        ));
      }

      if (status === 429) {
        const timestamp = await res.value.text();
        const resetDate = new Date(+timestamp);
        const date = new Intl.DateTimeFormat("en-GB", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(resetDate);
        const [day, hour] = date.split(", ");

        id = toaster.show((props) => (
          <ContactFormToast
            toastId={props.toastId}
            error={true}
            title="Dzienna ilość wiadomości przekroczona!"
            description={`Limit resetuje się dnia ${day} o godzinie ${hour}.`}
          />
        ));
      }

      if ((status >= 400 && status <= 404) || status === 500) {
        id = toaster.show((props) => (
          <ContactFormToast
            toastId={props.toastId}
            error={true}
            title="Nie udało się wysłać wiadomości."
            description="Spróbuj ponownie później."
          />
        ));
      }

      setToastId(id);
    } catch (error) {
      console.error(error);

      const id = toaster.show((props) => (
        <ContactFormToast
          toastId={props.toastId}
          error={true}
          title="Wystąpił nieoczekiwany błąd."
          description="Spróbuj ponownie później."
        />
      ));

      setToastId(id);
    }
  };

  return (
    <>
      <ContactDialog isOpen={isOpen} toggleDialog={toggleDialog}>
        <Dialog.Content
          onCloseAutoFocus={() => shouldReset() && reset(contactForm)}
          asChild
          class="mx-auto flex w-full max-w-md transform flex-col gap-y-1 rounded-2xl bg-neutral-100 p-4 shadow-xl ring-1 ring-neutral-900/5 focus:outline-none ui-expanded:animate-fade-in-from-bottom ui-not-expanded:animate-fade-out-to-bottom lg:p-6"
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
              <Field
                validate={[required("Musisz zaakceptować to pole")]}
                name="privacyPolicy"
                type="boolean"
              >
                {(field, props) => (
                  <label
                    class={`flex items-center gap-x-2.5 text-sm lg:gap-x-3 lg:text-base ${
                      field.error ? "text-red-600" : ""
                    }`}
                  >
                    <input
                      class="h-4 w-4 cursor-pointer rounded-md accent-accent"
                      {...props}
                      type="checkbox"
                      checked={field.value}
                    />
                    <span>
                      Akceptuję warunki{" "}
                      <a class="underline" href="/privacy-policy">
                        Polityki Prywatności
                      </a>
                    </span>
                  </label>
                )}
              </Field>
              <Field name="honeypot">
                {(field, props) => (
                  <div class="hidden">
                    <label>
                      Nie wypełniaj tego pola jeśli jesteś człowiekiem:
                    </label>
                    <input {...props} value={field.value} />
                  </div>
                )}
              </Field>
            </div>
            <div class="mt-2 flex items-center justify-between text-sm lg:mt-5 lg:text-base">
              <Dialog.CloseButton
                aria-label="Zamknij"
                class="ml-0.5 font-medium transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
              >
                Zamknij
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
      </ContactDialog>
      <Portal>
        <Toast.Region
          duration={10000}
          limit={1}
          aria-label="Powiadomienia (alt+T)"
        >
          <Toast.List />
        </Toast.Region>
      </Portal>
    </>
  );
};

export default ContactForm;
