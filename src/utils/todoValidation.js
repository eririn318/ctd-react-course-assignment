// Validates todo title: must be non-empty and within 20 characters
export default function isValidTodoTitle(title) {
  // if (title.trim() !== "") return true
  //     // else if(title === "") return false =>this will return undefined if " "/title === "" → also false (because " " is not exactly "")
  // return false
  //     //if (valid) return true
  //     // else if (exact empty string) return false
  //     // But logically, you actually want:
  //     // “Anything not valid should be false”

  const trimmedTitle = title.trim();
  return (
    trimmedTitle !== "" && trimmedTitle.length <= 20
    //Validation checks:
    // 1. not empty
    // 2. not only spaces
    // 3. not too long (<= 20)
  );
}

// final check before saving, UI maxLength={20} make sense, but if UI maxLength=={100}, rules still checks for maxLength =20.
