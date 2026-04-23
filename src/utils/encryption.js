import CryptoJS from 'crypto-js'

// Basic auth header — base64 of "nsdlab-internal-client:nsdlab-internal-password"
export const LOGIN_BASIC_AUTH = 'Basic bnNkbGFiLWludGVybmFsLWNsaWVudDpuc2RsYWItaW50ZXJuYWwtcGFzc3dvcmQ='

// Base64-encoded AES-256 key (from environment.encryption_key in Angular app)
const BASE64_KEY = import.meta.env.VITE_AES_KEY || 'a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU='

/**
 * Mirrors EncryptUtilsService.encryptRequest() exactly:
 * 1. Generate random 16-byte IV
 * 2. Decode key from base64
 * 3. AES-CBC + PKCS7 encrypt
 * 4. Prepend IV to ciphertext
 * 5. Base64-encode the combined result
 * 6. Return { RequestData: "<base64>" }
 */
export function encryptRequest(data) {
  const body = typeof data === 'string' ? data : JSON.stringify(data)

  // Random IV (16 bytes = 4 words)
  const iv = CryptoJS.lib.WordArray.random(16)

  // Decode key from base64
  const decodedKey = CryptoJS.enc.Base64.parse(BASE64_KEY)

  // Encrypt
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(body),
    decodedKey,
    {
      iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  )

  // Combine IV + ciphertext then base64-encode
  const combined = iv.concat(encrypted.ciphertext)
  return { RequestData: CryptoJS.enc.Base64.stringify(combined) }
}

/**
 * Mirrors EncryptUtilsService.decryptResponse() exactly:
 * 1. Decode base64
 * 2. First 16 bytes = IV, rest = ciphertext
 * 3. AES-CBC decrypt
 * 4. removeNoise — trim to last '}'
 */
export function decryptResponse(encryptedString) {
  const byteCipherText = CryptoJS.enc.Base64.parse(encryptedString)

  const iv         = CryptoJS.lib.WordArray.create(byteCipherText.words.slice(0, 4), 16)
  const cipherText = CryptoJS.lib.WordArray.create(
    byteCipherText.words.slice(4),
    byteCipherText.sigBytes - 16
  )

  const decodedKey = CryptoJS.enc.Base64.parse(BASE64_KEY)

  const decrypted = CryptoJS.AES.decrypt(
    CryptoJS.lib.CipherParams.create({ ciphertext: cipherText }),
    decodedKey,
    {
      iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  )

  const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
  return removeNoise(decryptedStr)
}

// Trim to last closing brace — mirrors removeNoise() in Angular service
function removeNoise(data) {
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i] === '}') return data.slice(0, i + 1)
  }
  return data
}

export function buildGeoLocation() {
  return btoa(JSON.stringify({
    device: 'WEB',
    latitude: 0,
    longitude: 0,
    city: '',
    country: 'India',
    continent: 'Asia',
  }))
}
