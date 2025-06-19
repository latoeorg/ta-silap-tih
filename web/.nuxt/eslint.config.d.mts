import type { FlatConfigComposer } from "../node_modules/.pnpm/eslint-flat-config-utils@2.1.0/node_modules/eslint-flat-config-utils/dist/index.mjs"
import { defineFlatConfigs } from "../node_modules/.pnpm/@nuxt+eslint-config@1.4.1_@typescript-eslint+utils@8.33.1_eslint@9.28.0_jiti@2.4.2__typ_d59bbcdc453a43a2c20e0b4a2514cd1d/node_modules/@nuxt/eslint-config/dist/flat.mjs"
import type { NuxtESLintConfigOptionsResolved } from "../node_modules/.pnpm/@nuxt+eslint-config@1.4.1_@typescript-eslint+utils@8.33.1_eslint@9.28.0_jiti@2.4.2__typ_d59bbcdc453a43a2c20e0b4a2514cd1d/node_modules/@nuxt/eslint-config/dist/flat.mjs"

declare const configs: FlatConfigComposer
declare const options: NuxtESLintConfigOptionsResolved
declare const withNuxt: typeof defineFlatConfigs
export default withNuxt
export { withNuxt, defineFlatConfigs, configs, options }