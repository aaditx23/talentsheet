export interface ThemeSettings {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    border: string;
    input: string;
    ring: string;
}

export interface ThemePreset extends ThemeSettings {
    name: string;
}

export interface UserEntity {
    id: string; // Typically maps to Convex Id<"users">
    username: string; // e.g. 'user01' used in URL routing
    displayName: string;
    tagline: string;
    about: string;
    themeSettings?: ThemeSettings;
    themePresets?: ThemePreset[];
}
