import DOMPurify from "dompurify";
// Validates and sanitizes filter input before applying search
export default function validateFilterInput(value) {
  //value = input parameter(the user's text)
  const errors = [];
  //1.validate first
  if (value.length > 15) {
    errors.push("Maximum 15 characters allowed.");
  }

  //2.sanitize after validation
  const clean = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  return {
    isValid: errors.length === 0,
    errors,
    value: clean, //returned object field
  };
}
