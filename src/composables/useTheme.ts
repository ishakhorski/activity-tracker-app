import { ref, watch, type Ref } from "vue";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "app-theme";
const systemMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const theme: Ref<Theme> = ref((localStorage.getItem(STORAGE_KEY) as Theme) ?? "system");

function applyTheme(value: Theme): void {
  const isDark = value === "dark" || (value === "system" && systemMediaQuery.matches);
  document.documentElement.classList.toggle("dark", isDark);
}

systemMediaQuery.addEventListener("change", () => {
  if (theme.value === "system") applyTheme("system");
});

watch(
  theme,
  (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    applyTheme(value);
  },
  { immediate: true },
);

export function useTheme(): {
  theme: Ref<Theme>;
} {
  return { theme };
}
