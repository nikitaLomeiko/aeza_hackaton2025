import * as v from 'valibot'

export const SecretConfigSchema = v.object({
  file: v.optional(v.string()),
  external: v.optional(
    v.union([
      v.boolean(),
      v.object({
        name: v.optional(v.string()),
      }),
    ])
  ),
  labels: v.optional(v.record(v.string(), v.string())),
  name: v.optional(v.string()),
  environment: v.optional(v.string()),
  content: v.optional(v.string()),
})

export type ValidatedSecretConfig = v.InferOutput<typeof SecretConfigSchema>

export function validateSecretConfig(data: unknown) {
  return v.safeParse(SecretConfigSchema, data)
}
