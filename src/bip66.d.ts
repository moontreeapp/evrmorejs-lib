/**
 * Check if a buffer is a valid DER-encoded signature.
 * @param buffer - The buffer to check.
 * @returns True if the buffer is a valid DER-encoded signature, false otherwise.
 */
export declare function check(buffer: Buffer): boolean;
/**
 * Decode a DER-encoded signature into r and s values.
 * @param buffer - The buffer to decode.
 * @returns An object containing the r and s values.
 */
export declare function decode(buffer: Buffer): {
    r: Buffer;
    s: Buffer;
};
/**
 * Encode r and s values into a DER-compliant signature.
 * Ensures positive values, properly padded if necessary.
 * @param r - The r value to encode.
 * @param s - The s value to encode.
 * @returns The encoded signature.
 */
export declare function encode(r: Buffer, s: Buffer): Buffer;
