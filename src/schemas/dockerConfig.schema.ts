import * as v from 'valibot'

const BaseConfigConfigSchema = v.object({
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
  content: v.optional(v.string()),
})

export const ConfigConfigSchema = v.pipe(
  BaseConfigConfigSchema,
  v.check(
    (input) => !!input.file || !!input.content,
    'Either file or content must be provided'
  )
)

export type ValidatedConfigConfig = v.InferOutput<typeof ConfigConfigSchema>

export function validateConfigConfig(data: unknown) {
  return v.safeParse(ConfigConfigSchema, data)
}
