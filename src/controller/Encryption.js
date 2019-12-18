class CryptoController {
  constructor() {
    this.srcText = null;
    this.unicodedNumbersFrom_srcText = null;
    this.encryptedText = null;

    this.encodingMatrix = [
      [1, -1, -1, 1],
      [2, -3, -5, 4],
      [-2, -1, -2, 2],
      [3, -3, -1, 2]
    ];
    this.decodingMatrix = [
      [6, -1, 0, -1],
      [22, -4, 1, -4],
      [14, -3, 1, -2],
      [31, -6, 2, -5]
    ];
  }

  getMatrixFromArray(arr, rows) {
    var matrix = new Array();
    for (var i = 0; i < rows; i++) matrix[i] = new Array();

    for (var i = 0; i < arr.length; i++) matrix[i % rows][Math.floor(i / rows)] = arr[i];

    if (arr.length % rows != 0)
      for (var i = arr.length % rows; i < rows; i++) matrix[i][Math.floor((arr.length - 1) / rows)] = 0;

    return matrix;
  }

  getMatrixFromText(text, rows) {
    var arr = new Array();
    for (var i = 0; i < text.length; i++) arr[i] = text.charCodeAt(i);
    return this.getMatrixFromArray(arr, rows);
  }

  getTextFromMatrix(matrix) {
    var text = new String();
    for (var j = 0; j < matrix[0].length; j++)
      for (var i = 0; i < matrix.length; i++) text += matrix[i][j] > 0 ? String.fromCharCode(matrix[i][j]) : "";
    return text;
  }

  getMatrixFromNumbers(text, rows) {
    var i = 0;
    var numbers = text.split(" ");
    while (i < numbers.length) {
      if (numbers[i].replace(/s+/g, "") == "") numbers.splice(i, 1);
      else i++;
    }
    var arr = new Array();
    for (var i = 0; i < numbers.length; i++) arr[i] = parseInt(numbers[i]);

    return this.getMatrixFromArray(arr, rows);
  }

  getNumbersFromMatrix(matrix) {
    var text = "";
    for (var j = 0; j < matrix[0].length; j++)
      for (var i = 0; i < matrix.length; i++) text += matrix[i][j].toString() + " ";
    return text;
  }

  multiplyMatrices(m1, m2) {
    var matrix = new Array();
    for (var i = 0; i < m1.length; i++) matrix[i] = new Array();

    for (var i = 0; i < m1.length; i++)
      for (var j = 0; j < m2[0].length; j++) {
        matrix[i][j] = 0;
        for (var k = 0; k < m1[0].length; k++) matrix[i][j] += m1[i][k] * m2[k][j];
      }
    return matrix;
  }

  numberToChar(text) {
    var result = new String();
    for (var i = 0; i < text.length; i++)
      result += String.fromCharCode(text.charCodeAt(i) + (text.charCodeAt(i) == 32 ? 33 : 21));
    return result;
  }

  charToNumber(text) {
    var result = new String();
    for (var i = 0; i < text.length; i++)
      result += String.fromCharCode(text.charCodeAt(i) - (text.charCodeAt(i) == 65 ? 33 : 21));
    return result;
  }

  encryptText(text) {
    this.srcText = text;
    /* Convert the srcText to an Matrix, converting char to charCode(unicode) */
    const matrixFrom_srcText = this.getMatrixFromText(this.srcText, 4);
    /* Multiplies the source text matrix by the enconding matrix */
    const multipliedMatrix = this.multiplyMatrices(this.encodingMatrix, matrixFrom_srcText);
    /* Converts the multiplied matrix to string */
    const numbersFrom_srcText = this.getNumbersFromMatrix(multipliedMatrix);
    /* Converts the  multiplied matrix to an encryptedChar sequence*/
    this.encryptedText = this.numberToChar(numbersFrom_srcText);

    return this.encryptedText;
  }

  getEncryptedText() {
    return this.encryptedText;
  }

  decryptText(encryptedText) {
    /* Converts encrypted string to numbers */
    const encryptedNumbers = this.charToNumber(encryptedText);
    /* Converts numbers to matrix */
    var matrixFromText = this.getMatrixFromNumbers(encryptedNumbers, 4);
    /* Multiply encrypted matrix by the decondig matrix */
    var plainMatrixFromText = this.multiplyMatrices(this.decodingMatrix, matrixFromText);
    /* Convets unicode to char, revealing the encrypted text */
    let decryptedDataFromText = this.getTextFromMatrix(plainMatrixFromText);
    return decryptedDataFromText;
  }
}

module.exports = CryptoController;
