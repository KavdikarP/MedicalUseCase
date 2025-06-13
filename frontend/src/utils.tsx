export function fixMarkdownNewlines(markdownText: string) {
  // Regular expression to match lines that do not end with two spaces followed by a newline
  const regex = /(?<!  )\n/g;

  // Replacement function to ensure lines end with two spaces before a newline
  const replacement = function (match: string) {
    return "  \n";
  };

  // Replace occurrences where needed
  return markdownText.replace(regex, replacement);
}
