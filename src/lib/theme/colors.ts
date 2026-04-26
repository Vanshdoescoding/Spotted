export const colors = {
  background: "#F7F4ED",
  surface: "#FFFFFF",
  surfaceMuted: "#EFE9DC",
  forest: "#1F4D3A",
  forestSoft: "#DDE8DF",
  moss: "#6D8467",
  amber: "#B7791F",
  amberSoft: "#F3E5C8",
  danger: "#A0443E",
  dangerSoft: "#F2D8D5",
  text: "#17211C",
  textMuted: "#647067",
  border: "#DED7C9",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export type AppColor = keyof typeof colors;

