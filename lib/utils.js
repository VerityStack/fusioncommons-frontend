export const sanitizeTitle = (title) => {
  if (!title) return "";
  return title
    .replace(/\$\^\{?(\d+)\}?\$/g, "^$1")
    .replace(/\$/g, "")
    .replace(/\\-/g, "-");
};