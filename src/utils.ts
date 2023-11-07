export function cn(...args: unknown[]): string {
  return args
    .filter((arg) => typeof arg === "string" && arg.length !== 0)
    .join(" ");
}

export function lockScroll(lock: boolean) {
  const body = document.querySelector("html")!;

  if (lock) {
    body.style.height = "100vh";
    body.style.overflow = "hidden";
  } else {
    body.style.height = "unset";
    body.style.overflow = "unset";
  }
}

type UrlStateWithHash = {
  hash?: string;
  aboutCollapsible?: "open";
  contactForm?: "open";
};

type UrlState = Omit<UrlStateWithHash, "hash">;
type UrlStateKeys = keyof UrlState;
type UrlStateReturn<T extends UrlStateKeys> = Required<UrlState>[T] | null;

export function setUrlState({ hash, ...state }: UrlStateWithHash) {
  const url = new URL(window.location.href);

  // Hash could be an empty string
  if (typeof hash === "string") {
    url.hash = hash;
  }

  for (const key in state) {
    const element = state[key as UrlStateKeys];
    if (element) {
      url.searchParams.set(key, element);
    } else {
      url.searchParams.delete(key);
    }
  }

  window.history.replaceState(null, "", url);
}

export function getUrlState<T extends UrlStateKeys>(key: T): UrlStateReturn<T>;
export function getUrlState(): UrlState;

export function getUrlState(key?: UrlStateKeys) {
  // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (navigator.connection?.effectiveType !== "4g") return null;

  const params = new URLSearchParams(window.location.search);
  return key ? params.get(key) : Object.fromEntries(params);
}
