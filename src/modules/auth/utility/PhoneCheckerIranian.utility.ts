export class PhoneCheckerIranianUtility {
  /**
   * Checks if the input mobile number is an Iranian number
   * @param input - Input string (mobile number)
   * @returns boolean - True if the number is Iranian, false otherwise
   */
  static isIranianMobile(input: string): boolean {
    // Regex to match Iranian mobile numbers
    const iranMobileRegex = /^(\+98|0)?9\d{9}$/;
    return iranMobileRegex.test(input);
  }
}
