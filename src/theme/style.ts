import { themeColors, ThemeColorMap } from "./colors";

const toCssVariables = (values: ThemeColorMap): string => {
  return Object.entries(values)
    .map(([name, value]) => `--${name}: ${value};`)
    .join("\n");
};

export const themeStyles = `
:root {
${toCssVariables(themeColors.light)}
}

.dark {
${toCssVariables(themeColors.dark)}
}
`;
