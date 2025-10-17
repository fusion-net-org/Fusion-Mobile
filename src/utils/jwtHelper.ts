/**
 * Decode JWT token without verification (client-side only)
 * @param token JWT token string
 * @returns Decoded payload object
 */
export const decodeJWT = (token: string): any => {
  try {
    console.log(token);
    // Check if token exists and is a string
    if (!token || typeof token !== 'string') {
      console.error('❌ Token passed to getJWTPayload is invalid:', token);
      throw new Error('Token is undefined or not a string');
    }

    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Decode payload (middle part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);

    // Decode base64url to string
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));

    // Parse JSON
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeJWT(token);
  return payload?.sub || null;
};

export const getJWTPayload = (token: string): any => {
  return decodeJWT(token);
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};
