import type { SchemaVersion } from '@/types';

export interface GenerateSchemaOptions {
  version: SchemaVersion;
  strictMode: boolean;
}

function getSchemaUri(version: SchemaVersion): string {
  const uris: Record<SchemaVersion, string> = {
    '2020-12': 'https://json-schema.org/draft/2020-12/schema',
    '2019-09': 'https://json-schema.org/draft/2019-09/schema',
    'draft-07': 'http://json-schema.org/draft-07/schema#',
    'draft-04': 'http://json-schema.org/draft-04/schema#',
  };
  return uris[version];
}

function inferType(
  value: unknown,
): 'null' | 'array' | 'object' | 'string' | 'integer' | 'number' | 'boolean' {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'string';
}

function detectStringFormat(value: string): string | undefined {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(value)) {
    return 'date-time';
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'email';
  }
  if (/^https?:\/\/[^\s]+$/.test(value)) {
    return 'uri';
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    return 'uuid';
  }
  return undefined;
}

function buildSchema(
  value: unknown,
  options: GenerateSchemaOptions,
  isRoot = false,
): Record<string, unknown> {
  const type = inferType(value);
  const schema: Record<string, unknown> = {};

  if (isRoot) {
    schema['$schema'] = getSchemaUri(options.version);
    schema['$id'] = 'https://example.com/schema.json';
    schema['title'] = 'Root';
    schema['description'] = 'Generated schema';
  }

  if (type === 'object' && value !== null) {
    schema['type'] = 'object';
    const obj = value as Record<string, unknown>;
    const properties: Record<string, unknown> = {};
    const keys = Object.keys(obj);

    for (const key of keys) {
      properties[key] = buildSchema(obj[key], options);
    }

    schema['properties'] = properties;

    if (options.strictMode && keys.length > 0) {
      schema['required'] = keys;
      schema['additionalProperties'] = false;
    }
  } else if (type === 'array') {
    schema['type'] = 'array';
    const arr = value as unknown[];

    if (arr.length === 0) {
      schema['items'] = {};
    } else {
      const itemSchemas = arr.map((item) => buildSchema(item, options));
      const serialized = itemSchemas.map((s) => JSON.stringify(s));
      const unique = [...new Set(serialized)].map((s) => JSON.parse(s) as Record<string, unknown>);

      if (unique.length === 1) {
        schema['items'] = unique[0];
      } else {
        schema['items'] = { anyOf: unique };
      }
    }
  } else if (type === 'string') {
    schema['type'] = 'string';
    const str = value as string;
    const format = detectStringFormat(str);
    if (format) schema['format'] = format;
    if (str.length > 0) schema['minLength'] = 1;
  } else if (type === 'integer') {
    schema['type'] = 'integer';
  } else if (type === 'number') {
    schema['type'] = 'number';
  } else if (type === 'boolean') {
    schema['type'] = 'boolean';
  } else if (type === 'null') {
    schema['type'] = 'null';
  }

  return schema;
}

export function generateJsonSchema(
  data: unknown,
  options: GenerateSchemaOptions,
): Record<string, unknown> {
  return buildSchema(data, options, true);
}
