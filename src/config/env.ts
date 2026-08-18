import { z } from 'zod'

/* Every environment variable the app reads must be declared here.
   Parsing happens once at module load (imported from main.tsx), so a
   missing or malformed variable crashes the app at boot instead of
   surfacing as undefined behaviour later. */
const envSchema = z.object({
  DEV: z.boolean(),
  MODE: z.string().min(1),
  PROD: z.boolean(),
  VITE_APP_NAME: z.string().min(1).default('onform'),
})

export type Env = z.infer<typeof envSchema>

function parseEnv(raw: unknown): Env {
  const result = envSchema.safeParse(raw)
  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${z.prettifyError(result.error)}`,
    )
  }
  return result.data
}

export const env = parseEnv(import.meta.env)
