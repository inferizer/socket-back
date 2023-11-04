function mobileFormat(mobile) {
  // remove all non-numeric from string
  const filterNumber = mobile.replace(/\D/g, "");

  return (
    filterNumber.substring(0, 3) +
    "-" +
    filterNumber.substring(3, 6) +
    "-" +
    filterNumber.substring(6)
  );
}

module.exports = mobileFormat;
