export class ErrorWithStatus extends Error {
  /**
   * Crea una instacia de ErrorWithStatus.
   * @param {number} status - El codigo HTTP.
   * @param {string} message - El mensaje de error.
   * @param {ErrorOptions} [options] - Parametros opcionales para guardar mas informacion del error
   */
  constructor(status, message, options) {
    super(message, options);
    this.status = status;
  }
}
