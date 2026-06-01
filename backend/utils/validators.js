// Server-side input verifiers

const isValidNamalEmail = (email) => {
  if (!email) return false;
  return email.toLowerCase().endsWith('@namal.edu.pk');
};

const isValidRegNumber = (regNum) => {
  if (!regNum) return false;
  // Matches NUM-[DEPT]-[YEAR]-[ID] e.g., NUM-BSCS-2022-41
  const regRegex = /^NUM-[A-Z]{3,4}-\d{4}-\d{1,3}$/i;
  return regRegex.test(regNum);
};

module.exports = {
  isValidNamalEmail,
  isValidRegNumber
};
