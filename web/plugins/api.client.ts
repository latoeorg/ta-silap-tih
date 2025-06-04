import { defineNuxtPlugin } from "#app";
import { useApi } from "~/composables/useApi";

export default defineNuxtPlugin(() => {
  const { api } = useApi();

  return {
    provide: {
      api,
    },
  };
});
