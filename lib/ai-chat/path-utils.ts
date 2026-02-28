type PathPart = string | number;

function parsePath(path: string): PathPart[] {
  const normalized = path.replace(/\[(\d+)\]/g, '.$1');
  return normalized
    .split('.')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => (/^\d+$/.test(part) ? Number(part) : part));
}

export function getPathValue(input: unknown, path: string): unknown {
  const parts = parsePath(path);
  let current = input;
  for (const part of parts) {
    if (current == null) return undefined;
    if (typeof part === 'number') {
      if (!Array.isArray(current)) return undefined;
      current = current[part];
      continue;
    }
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function setPathValue(input: unknown, path: string, value: unknown): unknown {
  const parts = parsePath(path);
  if (!parts.length) return input;

  const root =
    input && typeof input === 'object'
      ? Array.isArray(input)
        ? [...input]
        : { ...(input as Record<string, unknown>) }
      : {};

  let current: unknown = root;
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    const isLast = index === parts.length - 1;
    if (typeof part === 'number') {
      if (!Array.isArray(current)) {
        throw new Error(`Invalid array path segment at index ${index}`);
      }
      if (isLast) {
        current[part] = value;
        break;
      }
      const next = current[part];
      if (next == null || typeof next !== 'object') {
        const nextPart = parts[index + 1];
        current[part] = typeof nextPart === 'number' ? [] : {};
      } else {
        current[part] = Array.isArray(next) ? [...next] : { ...(next as Record<string, unknown>) };
      }
      current = current[part];
      continue;
    }

    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      throw new Error(`Invalid object path segment "${part}" at index ${index}`);
    }
    const currentObject = current as Record<string, unknown>;
    if (isLast) {
      currentObject[part] = value;
      break;
    }
    const existing = currentObject[part];
    if (existing == null || typeof existing !== 'object') {
      const nextPart = parts[index + 1];
      currentObject[part] = typeof nextPart === 'number' ? [] : {};
    } else {
      currentObject[part] = Array.isArray(existing) ? [...existing] : { ...(existing as Record<string, unknown>) };
    }
    current = currentObject[part];
  }

  return root;
}

export function slugify(raw: string) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
