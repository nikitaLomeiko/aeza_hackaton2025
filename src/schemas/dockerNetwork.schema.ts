import * as v from 'valibot'

export const NetworkConfigSchema = v.object({
  driver: v.optional(v.string()),
  driver_opts: v.optional(v.record(v.string(), v.string())),
  attachable: v.optional(v.boolean()),
  enable_ipv6: v.optional(v.boolean()),
  ipam: v.optional(
    v.object({
      driver: v.optional(v.string()),
      config: v.optional(
        v.array(
          v.object({
            subnet: v.optional(v.string()),
            ip_range: v.optional(v.string()),
            gateway: v.optional(v.string()),
            aux_addresses: v.optional(v.record(v.string(), v.string())),
          })
        )
      ),
      options: v.optional(v.record(v.string(), v.string())),
    })
  ),
  internal: v.optional(v.boolean()),
  labels: v.optional(v.record(v.string(), v.string())),
  external: v.optional(
    v.union([
      v.boolean(),
      v.object({
        name: v.optional(v.string()),
      }),
    ])
  ),
  name: v.pipe(v.string(), v.minLength(1)),
})

export type ValidatedNetworkConfig = v.InferOutput<typeof NetworkConfigSchema>

export function validateNetworkConfig(data: unknown) {
  return v.safeParse(NetworkConfigSchema, data)
}
