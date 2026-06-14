export const validateInput = (input, options = {}) => {
  //It receives input = the user's text & options = rules for checking
  //ex: validateInput("hello", {
  //    required: true,
  //    maxLength: 10})

  const errors = [];
  const value = input?.trim() || "";
  //? is optional chaining
  //IF input exist,
  //  run input.trim()
  //ELSE
  //  return undefined

  // required check
  if (options.required && value.length === 0) {
    //Does the options object have required: true? && Is the input empty? (true, value.length===0)
    errors.push("This field is required.");
  }

  //max length check
  if (options.maxLength && value.length > options.maxLength) {
    errors.push(`Maximum ${options.maxLength} characters allowed.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    value,
  };
};

//==========validation==========
// This function is doing validation.
// Validation means:
// "Does this input follow the rules we decided?"

//==========parameters==========
// ex:
// if input = "", required = true
// errors.push("This field is required.")
// -> errors =[] becomes,
// errors = [
//   "This field is required."
// ]

//==========return==========
// ex:
// Input:
// "John"

// Rules:
// {
//  required:true,
//  maxLength:10
// }-> no problems -> errors = [] -> errors.length === 0 is true
// will become
// return {
//     isValid: true (errors.length===0),
//     errors: []
//     value: "John"
// }

//==========in form flow==========

// if (!result.isValid) {
//   setError(result.errors);
//   return;
// }

// You are saying:
// Run validation
//         ↓
// If validation failed
//         ↓
// show error
//         ↓
// stop

// Only after this:
// const cleanName = sanitizeInput(result.value)

//==========what is validation & sanitization==========
// Validation → "Is this allowed?"
// Sanitization → "Make this safe"
