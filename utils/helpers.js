/*module.exports = {
  toUpperCase: (string) => string.toUpperCase(),
};
*/
module.exports = {
  toUpperCase: (str) => (typeof str === 'string' ? str.toUpperCase() : ''),


  eq: (a, b, options) => {
    return a === b;
  },


  formatDate: (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB');  // DD/MM/YYYY format
  }
};


