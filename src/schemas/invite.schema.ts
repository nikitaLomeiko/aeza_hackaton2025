import * as v from 'valibot'

export const InviteSchema = v.object({
  email: v.pipe(
    v.string('Email обязателен'),
    v.email('Введите корректный email адрес'),
    v.minLength(1, 'Email обязателен')
  ),
})

export type ValidatedInviteData = v.InferOutput<typeof InviteSchema>

export function validateInviteData(data: unknown) {
  return v.safeParse(InviteSchema, data)
}
