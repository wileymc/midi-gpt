export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function parseCode(response: string) {
  type Code = {
    key: string;
    code: string;
  };

  const codes: Code[] = [];

  while (true) {
    const start = response.indexOf("```");
    const end = response.lastIndexOf("```");

    if (start === -1 || end === -1 || start >= end) {
      // No more blocks to find or incorrectly nested backticks
      break;
    }

    // Extract the block between the backticks
    const block = response.slice(start + 3, end).trim();
    const newlineIndex = block.indexOf("\n");

    if (newlineIndex !== -1) {
      codes.push({
        key: block.slice(0, newlineIndex),
        code: block.slice(newlineIndex + 1),
      });
    } else {
      codes.push({
        key: block,
        code: "",
      });
    }

    // Remove this block from the response for subsequent iterations
    response = response.slice(0, start) + response.slice(end + 3);
  }

  if (codes.length === 0) {
    // No code blocks found, treat the entire response as a single code block
    codes.push({
      key: "",
      code: response.trim(),
    });
  }

  return codes
    .map((code) => code.code)
    .join("\n\n")
    .trim();
}
