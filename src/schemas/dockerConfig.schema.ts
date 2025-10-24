import * as v from 'valibot'

export const ConfigConfigSchema = v.object({
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
  name: v.pipe(
    v.string('Name must be a string'),
    v.minLength(1, 'Name is required and cannot be empty')
  ),
  content: v.optional(v.string()),
})

export type ValidatedConfigConfig = v.InferOutput<typeof ConfigConfigSchema>

export function validateConfigConfig(data: unknown) {
  return v.safeParse(ConfigConfigSchema, data)
}
