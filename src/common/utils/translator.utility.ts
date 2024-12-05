import { I18nContext } from 'nestjs-i18n';

export class Translator {
  /**
   * Static method for translating keys
   * @param key - Translation key
   * @param args - Optional arguments for placeholders
   * @returns Translated text
   */
  static async translate(key: string, args?: Record<string, any>): Promise<string> {
    const i18n = I18nContext.current();

    if (!i18n) {
      throw new Error('I18nContext is not available. Make sure it is set up correctly.');
    }

    return i18n.t(key, { args });
  }
}
