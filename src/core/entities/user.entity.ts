export interface ThemeSettings {
    primary: string;
    secondary: string;
    background: string;
    textMain: string;
    accent: string;
}

export interface UserEntity {
    id: string; // Typically maps to Convex Id<"users">
    username: string; // e.g. 'user01' used in URL routing
    displayName: string;
    tagline: string;
    about: string;
    themeSettings?: ThemeSettings;
}
