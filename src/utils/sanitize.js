import DOMPurify from "dompurify";

// Example: Sanitize user input using DOMPurify
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";
  // This prevents crashes if someone passes:

  // null
  // undefined
  // numbers
  // objects

  // It means:
  // 👉 “If input is NOT text, just turn it into empty string safely”
  // So:
  // null → ""
  // undefined → ""
  // 123 → ""
  // {} → ""

  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: [], // Remove all attributes
  });
};

// 👉 Sanitize = clean dangerous content from user input so it cannot break your app or run malicious code.

// only does:
// INPUT
//   ↓
// SANITIZE (clean)
//   ↓
// SAFE STRING

// It does not check:
// required field
// max length
// empty value
// email format
// etc.

// Ensure input validation runs before you sanitize the input with DOMPurify.
// means your final flow should be:
// User types
//     ↓
// VALIDATE <----This is validating
//     ↓
// If valid
//     ↓
// SANITIZE with DOMPurify <-----this is sanitize
//     ↓
// Send to API / save
