function removeOuterQuotes(str: string): string {
  const trimmed = str.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export async function encryptAES(plainText: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const byteData = encoder.encode(plainText);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-CBC' },
    false,
    ['encrypt'],
  );

  const iv = crypto.getRandomValues(new Uint8Array(16));
  const encryptedBuffer = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, byteData);

  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptAES(cipherText: string, secret: string): Promise<string> {
  const cleaned = removeOuterQuotes(cipherText);
  const binaryStr = atob(cleaned);
  const combined = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));

  const iv = combined.slice(0, 16);
  const encryptedData = combined.slice(16);

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-CBC' },
    false,
    ['decrypt'],
  );

  const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, encryptedData);

  return new TextDecoder().decode(decryptedBuffer);
}
