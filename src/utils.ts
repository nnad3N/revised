export function cn(...args: unknown[]): string {
  return args
    .filter((arg) => typeof arg === "string" && arg.length !== 0)
    .join(" ");
}

type UrlStateWithHash = {
  hash?: string;
  aboutCollapsible?: "open";
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
  const params = new URLSearchParams(window.location.search);
  return key ? params.get(key) : Object.fromEntries(params);
}
