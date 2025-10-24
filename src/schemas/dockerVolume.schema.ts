import * as v from 'valibot'

export const VolumeConfigSchema = v.object({
  driver: v.optional(v.string()),
  driver_opts: v.optional(v.record(v.string(), v.string())),
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
})

export type ValidatedVolumeConfig = v.InferOutput<typeof VolumeConfigSchema>

export function validateVolumeConfig(data: unknown) {
  return v.safeParse(VolumeConfigSchema, data)
}
