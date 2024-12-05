export class PasswordGenerator {
  /**
   * Static method to generate a random password
   * @param length - Desired length of the password
   * @returns A random password as a string
   */
  static generatePassword(length: number): string {
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numericChars = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    // Combine all character pools
    const allChars = lowerCaseChars + upperCaseChars + numericChars + specialChars;

    // Ensure minimum length requirement
    if (length < 4) {
      throw new Error('Password length must be at least 4 characters');
    }

    let password = '';

    // Add at least one character from each pool to ensure variety
    password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
    password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
    password += numericChars[Math.floor(Math.random() * numericChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the remaining length with random characters from all pools
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to randomize character positions
    return PasswordGenerator.shuffleString(password);
  }

  /**
   * Helper method to shuffle a string
   * @param str - Input string
   * @returns Shuffled string
   */
  private static shuffleString(str: string): string {
    return str.split('').sort(() => Math.random() - 0.5).join('');
  }
}
