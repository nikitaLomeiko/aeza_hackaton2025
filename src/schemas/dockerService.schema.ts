import {
  object,
  string,
  optional,
  record,
  array,
  union,
  literal,
  parse,
  safeParse,
  pipe,
  minLength,
} from "valibot";

// Порт — строка вида "8080:80" или просто "80"
const PortMappingSchema = string([
  // Можно добавить кастомный парсер, если нужно строгое соответствие формату
]);

// Перезапуск — только допустимые значения
const RestartPolicySchema = union([
  literal("no"),
  literal("always"),
  literal("on-failure"),
  literal("unless-stopped"),
]);

// Схема для ServiceConfig (только обязательные и валидируемые поля)
export const ServiceConfigSchema = object({
  image: string(), // обязательно
  container_name: pipe(string(), minLength(5)),
  ports: optional(array(PortMappingSchema)),
  environment: optional(record(string())),
  restart: optional(RestartPolicySchema),
  command: optional(union([string(), array(string())])),
  entrypoint: optional(union([string(), array(string())])),
  user: optional(string()),
  working_dir: optional(string()),
});

export type ValidatedServiceConfig = typeof ServiceConfigSchema._type;

// Экспортируем функции для удобства
export const validateServiceConfig = (data: unknown) =>
  safeParse(ServiceConfigSchema, data);
