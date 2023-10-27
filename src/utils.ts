export const cn = (...args: unknown[]): string =>
  args.filter((arg) => typeof arg === "string" && arg.length !== 0).join(" ");

type UrlState = {
  hash?: string;
  aboutCollapsible?: "open";
};

type UrlStateKeys = Exclude<keyof UrlState, "hash">;

export const setUrlState = ({ hash, ...state }: UrlState) => {
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
};

export const getUrlState = <T extends UrlStateKeys>(key?: T) => {
  const params = new URLSearchParams(window.location.search);

  return key ? (params.get(key) as UrlState[T] | null) : params;
};
