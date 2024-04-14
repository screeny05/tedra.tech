export const featureFlags = {
  storefront: false,
} as const satisfies Record<string, boolean>;

export const isEnabled = (flag: keyof typeof featureFlags) => featureFlags[flag];
