import { TypeIdentifierEnum } from '../enums/typeIdentifier.enum';

export class CheckIdentifier {
  /**
   * Static method to identify the type of input
   * @param input - Input string
   * @returns TypeIdentifierType ('PHONE', 'EMAIL', 'USERNAME')
   */
  static identify(input: string): TypeIdentifierEnum {
    if (this.isMobile(input)) {
      return TypeIdentifierEnum.PHONE;
    } else if (this.isEmail(input)) {
      return TypeIdentifierEnum.EMAIL;
    } else {
      return TypeIdentifierEnum.USERNAME;
    }
  }

  /**
   * Checks if the input is a valid international phone number
   * Supports E.164 format
   * @param input - Input string
   */
  private static isMobile(input: string): boolean {
    // Normalize the input (remove spaces, dashes, and parentheses)
    const normalizedInput = input.replace(/[\s\-()]/g, '');

    // General regex for international phone numbers (E.164 format)
    const internationalPhoneRegex = /^\+?[1-9]\d{1,14}$/;
    return internationalPhoneRegex.test(normalizedInput);
  }

  /**
   * Checks if the input is a valid email address
   * @param input - Input string
   */
  private static isEmail(input: string): boolean {
    // General regex for email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  }
}
