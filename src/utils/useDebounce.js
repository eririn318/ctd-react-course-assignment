import { useState, useEffect } from "react";
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value); // value=prep
  // value → the real-time value (changes constantly)
  // debouncedValue → the delayed copy (only updates after the user pauses)

  // At the very start, they are equal:
  // value         = ""

  // ex:delay = 500ms
  // ✅ useEffect runs every keystroke
  // type "h"              → timer starts (500ms)
  // type "e"  (100ms later) → timer RESETS (500ms again)
  // type "l"  (100ms later) → timer RESETS
  // type "l"  (100ms later) → timer RESETS
  // type "o"  (100ms later) → timer RESETS

  // ...stop typing...500ms passes
  // ✅ setDebouncedValue fires only after 500ms of no typing
  // debouncedValue = ""   ← useState(value) just copies the initial value
  // → debouncedValue = "hello" ✅

  // 1. value = ""          ← start here
  // 2. user types "hello"  ← value updates every keystroke
  //    value = "h"
  //    value = "he"
  //    value = "hel"
  //    value = "hell"
  //    value = "hello"
  // 3. useEffect runs      ← runs every keystroke (timer start/reset)
  // 4. ...500ms passes...  ← user stops typing
  // 5. setDebouncedValue("hello") fires
  // 6. debouncedValue = "hello" ✅

  useEffect(() => {
    const timerId = setTimeout(() => {
      //run this function after waiting delay milliseconds
      setDebouncedValue(value); // ← "hello" gets copied HERE
    }, delay); // ← after 500ms of no typing

    return () => {
      clearTimeout(timerId); // ← timer RESETS here (every keystroke)
    };
  }, [value, delay]); // ← runs every time you type

  return debouncedValue;
}
