<template>
  <div>
    <div class="grid gap-2 text-center mb-10">
      <h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p class="text-balance text-sm text-muted-foreground">
        Please enter your credentials to access your account.
      </p>
    </div>

    <form class="grid gap-6" @submit.prevent="onSubmit">
      <div class="grid gap-2">
        <Label for="email"> Email </Label>
        <Input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="name@example.com"
          :disabled="loading"
          auto-capitalize="none"
          auto-complete="email"
          auto-correct="off"
          required
        />
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <Label for="password"> Password </Label>
          <NuxtLink
            to="/forgot-password"
            class="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </NuxtLink>
        </div>
        <PasswordInput id="password" v-model="form.password" required />
      </div>
      <Button type="submit" class="w-full" :disabled="loading">
        <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
        Login
      </Button>
    </form>
    <!-- <div class="mt-4 text-center text-sm text-muted-foreground">
      Don't have an account?
      <NuxtLink to="/register" class="underline"> Sign up </NuxtLink>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useAuthStore, navigateTo } from "#imports";
import { ref, reactive } from "vue";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const authStore = useAuthStore();
const loading = ref(false);

const form = reactive({
  email: "",
  password: "",
});

const onSubmit = async () => {
  loading.value = true;

  try {
    await authStore.login(form.email, form.password);
    navigateTo("/dashboard");
  } catch (error: any) {
    console.error("Login error:", error);
    // Handle error (show toast, etc.)
  } finally {
    loading.value = false;
  }
};
</script>
