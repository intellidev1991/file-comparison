import {
  ComparisonResult,
  ComparisonResultType,
  DiffWord,
  DiffWordType,
  FileSection,
} from "@/tools/fileParse.types";

//Breaks files into sections based on markdown-like headers
export function parseFileContent(content: string): FileSection[] {
  const sections: FileSection[] = [];
  const lines = content.split("\n");
  let currentSection: FileSection | null = null;

  for (const line of lines) {
    if (line.startsWith("#")) {
      // Start of a new section
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        header: line.slice(1).trim(), // Remove leading #
        content: "",
      };
    } else if (currentSection) {
      // Add content to current section
      currentSection.content += line + "\n";
    }
  }

  // Add the last section
  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

//Compares sections between two files
export const compareFileSections = (
  sections1: FileSection[],
  sections2: FileSection[]
): ComparisonResult[] => {
  const results: ComparisonResult[] = [];
  const visited = new Set<number>();

  // Compare sections
  for (let i = 0; i < sections1.length; i++) {
    const section1 = sections1[i];
    let matched = false;

    for (let j = 0; j < sections2.length; j++) {
      if (visited.has(j)) continue;

      const section2 = sections2[j];

      if (section1.header === section2.header) {
        visited.add(j);
        matched = true;

        // Check if content is identical
        if (section1.content.trim() === section2.content.trim()) {
          results.push({
            type: ComparisonResultType.Unchanged,
            section: section1,
          });
          break;
        } else {
          // Content is different
          results.push({
            type: ComparisonResultType.Modified,
            section: section2,
            originalSection: section1,
          });
          break;
        }
      }
    }

    // If no match found, it's a deleted section
    if (!matched) {
      results.push({
        type: ComparisonResultType.Deleted,
        section: section1,
      });
    }
  }

  // Find added sections
  for (let j = 0; j < sections2.length; j++) {
    if (!visited.has(j)) {
      results.push({
        type: ComparisonResultType.Added,
        section: sections2[j],
      });
    }
  }

  return results;
};

//Performs word-level comparison with consecutive changed words
export const diffWords = (text1: string, text2: string): DiffWord[] => {
  const words1 = text1.split(/\s+/);
  const words2 = text2.split(/\s+/);
  const diffResult: DiffWord[] = [];

  let i = 0;
  while (i < Math.max(words1.length, words2.length)) {
    if (i < words1.length && i < words2.length) {
      if (words1[i] === words2[i]) {
        diffResult.push({ text: words1[i], type: DiffWordType.Unchanged });
        i++;
      } else {
        // Find consecutive changed words
        const changeGroup1: string[] = []; // Original words
        const changeGroup2: string[] = []; // Modified words

        while (
          i < words1.length &&
          i < words2.length &&
          words1[i] !== words2[i]
        ) {
          changeGroup1.push(words1[i]);
          changeGroup2.push(words2[i]);
          i++;
        }

        // Add removed and added change groups
        diffResult.push({
          text: changeGroup1.join(" "),
          type: DiffWordType.Removed,
        });
        diffResult.push({
          text: changeGroup2.join(" "),
          type: DiffWordType.Added,
        });
      }
    } else if (i < words1.length) {
      // this means text2 is shorter and text1 words are removed
      diffResult.push({ text: words1[i], type: DiffWordType.Removed });
      i++;
    } else if (i < words2.length) {
      // this means text1 is shorter and text2 words are added
      diffResult.push({ text: words2[i], type: DiffWordType.Added });
      i++;
    }
  }

  return diffResult;
};
