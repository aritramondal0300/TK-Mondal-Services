// Helper to convert string to ArrayBuffer
function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Helper to convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate HMAC signature using Web Crypto API
async function hmacSign(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    stringToBuffer(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    stringToBuffer(message)
  );
  return bufferToHex(signature);
}

/**
 * Signs a session token for the user.
 * @param username Username/ID of the admin
 * @param secret Secret key used for cryptographic signature
 * @returns Combined token string: payload.signature
 */
export async function signToken(username: string, secret: string): Promise<string> {
  // Session is valid for 7 days
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = JSON.stringify({ username, expiresAt });
  
  // Safe base64 encoding (Base64url format for cookies/URL safety)
  const base64Payload = btoa(payload)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    
  const signature = await hmacSign(base64Payload, secret);
  return `${base64Payload}.${signature}`;
}

/**
 * Verifies a session token.
 * @param token Cookie auth_token string
 * @param secret Secret key used for cryptographic signature
 * @returns Username if valid and active, null otherwise
 */
export async function verifyToken(token: string | null | undefined, secret: string): Promise<string | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const [base64Payload, signature] = parts;
  const expectedSignature = await hmacSign(base64Payload, secret);
  
  if (signature !== expectedSignature) {
    return null;
  }
  
  try {
    // Restore base64 padding before decoding
    let base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const payloadStr = atob(base64);
    const payload = JSON.parse(payloadStr);
    
    if (payload.expiresAt < Date.now()) {
      return null; // Expired
    }
    
    return payload.username;
  } catch (error) {
    return null;
  }
}
