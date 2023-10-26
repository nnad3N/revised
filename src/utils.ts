export const cn = (...args: unknown[]): string =>
  args.filter((arg) => typeof arg === "string" && arg.length !== 0).join(" ");
