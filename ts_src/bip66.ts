// Reference: https://github.com/bitcoin/bips/blob/master/bip-0066.mediawiki
// DER format: 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
// NOTE: SIGHASH byte ignored and restricted; truncate before use.

/**
 * Check if a buffer is a valid DER-encoded signature.
 * @param buffer - The buffer to check.
 * @returns True if the buffer is a valid DER-encoded signature, false otherwise.
 */
export function check(buffer: Buffer): boolean {
  if (buffer.length < 9 || buffer.length > 73) return false;
  if (buffer[0] !== 0x30 || buffer[1] !== buffer.length - 2) return false;
  if (buffer[2] !== 0x02) return false;

  const lenR = buffer[3];
  if (lenR === 0 || 5 + lenR >= buffer.length) return false;
  if (buffer[4 + lenR] !== 0x02) return false;

  const lenS = buffer[5 + lenR];
  if (lenS === 0 || 6 + lenR + lenS !== buffer.length) return false;

  return (
    !(buffer[4] & 0x80) &&
    !(lenR > 1 && buffer[4] === 0x00 && !(buffer[5] & 0x80)) &&
    !(buffer[lenR + 6] & 0x80) &&
    !(lenS > 1 && buffer[lenR + 6] === 0x00 && !(buffer[lenR + 7] & 0x80))
  );
}

/**
 * Decode a DER-encoded signature into r and s values.
 * @param buffer - The buffer to decode.
 * @returns An object containing the r and s values.
 */
export function decode(buffer: Buffer): { r: Buffer; s: Buffer } {
  if (buffer.length < 9 || buffer.length > 73)
    throw new Error('DER sequence length is invalid');
  if (buffer[0] !== 0x30 || buffer[1] !== buffer.length - 2)
    throw new Error('Invalid DER sequence');
  if (buffer[2] !== 0x02) throw new Error('Expected DER integer');

  const lenR = buffer[3];
  if (lenR === 0 || 5 + lenR >= buffer.length)
    throw new Error('Invalid R length');
  if (buffer[4 + lenR] !== 0x02) throw new Error('Expected second DER integer');

  const lenS = buffer[5 + lenR];
  if (lenS === 0 || 6 + lenR + lenS !== buffer.length)
    throw new Error('Invalid S length');

  if (
    buffer[4] & 0x80 ||
    (lenR > 1 && buffer[4] === 0x00 && !(buffer[5] & 0x80))
  )
    throw new Error('R value is invalid');

  if (
    buffer[lenR + 6] & 0x80 ||
    (lenS > 1 && buffer[lenR + 6] === 0x00 && !(buffer[lenR + 7] & 0x80))
  )
    throw new Error('S value is invalid');

  return {
    r: buffer.slice(4, 4 + lenR),
    s: buffer.slice(6 + lenR),
  };
}

/**
 * Encode r and s values into a DER-compliant signature.
 * Ensures positive values, properly padded if necessary.
 * @param r - The r value to encode.
 * @param s - The s value to encode.
 * @returns The encoded signature.
 */
export function encode(r: Buffer, s: Buffer): Buffer {
  const lenR = r.length;
  const lenS = s.length;

  // Validate the lengths of R and S
  if (lenR === 0 || lenS === 0) throw new Error('R or S length is zero');
  if (lenR > 33 || lenS > 33) throw new Error('R or S length is too long');

  // Check for negative values in R and S
  if (r[0] & 0x80) throw new Error('R value is negative');
  if (s[0] & 0x80) throw new Error('S value is negative');

  // Check for excessive padding in R and S
  if (lenR > 1 && r[0] === 0x00 && !(r[1] & 0x80))
    throw new Error('R value excessively padded');
  if (lenS > 1 && s[0] === 0x00 && !(s[1] & 0x80))
    throw new Error('S value excessively padded');

  // Allocate buffer for the signature
  const signature = Buffer.allocUnsafe(6 + lenR + lenS);

  // Construct the DER sequence
  signature[0] = 0x30;
  signature[1] = signature.length - 2;
  signature[2] = 0x02;
  signature[3] = lenR;
  r.copy(signature, 4);
  signature[4 + lenR] = 0x02;
  signature[5 + lenR] = lenS;
  s.copy(signature, 6 + lenR);

  return signature;
}
