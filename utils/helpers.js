/*module.exports = {
  toUpperCase: (string) => string.toUpperCase(),
};
*/
module.exports = {
  toUpperCase: (str) => (typeof str === 'string' ? str.toUpperCase() : ''),


eq: (a, b, options) => {
  return a === b ? options.fn(this) : options.inverse(this);
}
};

