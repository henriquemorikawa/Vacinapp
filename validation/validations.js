const {
  nameValidation,
  passwordValidation,
  emailValidation,
  // dateValidation,
  // zipCodeValidation
} = require('./fields.validation');

const validateSignup = (name, email, password, birthDate, zipCode) => {
  const errorsObj = {};

  const userNameErrors = nameValidation(name);
  if (userNameErrors.length > 0) {
    errorsObj.userNameErrors = userNameErrors;
  }

  const userEmailErrors = emailValidation(email);
  if (userEmailErrors.length > 0) {
    errorsObj.userEmailErrors = userEmailErrors;
  }

  const userPasswordErrors = passwordValidation(password);
  if (userPasswordErrors.length > 0) {
    errorsObj.userPasswordErrors = userPasswordErrors;
  }

  // const userBirthDateErrors = dateValidation(birthDate);
  // if (userBirthDateErrors.length > 0) {
  //   errorsObj.userBirthDateErrors = userBirthDateErrors;
  // }

  // const zipCodeValidationErrors = zipCodeValidation(zipCode);
  // if (zipCodeValidationErrors.length > 0) {
  //   errorsObj.zipCodeValidationErrors = zipCodeValidationErrors;
  // }

  return errorsObj;
}

module.exports = {
  validateSignup,
};