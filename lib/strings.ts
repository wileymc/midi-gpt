export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function urlSafeBase64Encode(str: string) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function urlSafeBase64Decode(str: string) {
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
}
