import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { parseFileContent, compareFileSections } from "@/tools/fileParse";
import {
  ComparisonCard,
  UnChangedCard,
} from "@/components/fileComparison/components";
import {
  ComparisonResult,
  ComparisonResultType,
} from "@/tools/fileParse.types";

interface FileComparisonProps {
  file1: string;
  file2: string;
}

export const FileComparison: React.FC<FileComparisonProps> = ({
  file1,
  file2,
}) => {
  const [comparisonResults, setComparisonResults] = useState<
    ComparisonResult[]
  >([]);

  const handleCompare = () => {
    const sections1 = parseFileContent(file1);
    const sections2 = parseFileContent(file2);

    const results = compareFileSections(sections1, sections2);
    setComparisonResults(results);
  };

  // Group and count identical sections
  const processedResults: ComparisonResult[] = [];
  let lastUnchangedIndex: number | null = null;

  comparisonResults.forEach((result, index) => {
    if (result.type === ComparisonResultType.Unchanged) {
      if (lastUnchangedIndex !== null) {
        processedResults[lastUnchangedIndex].count!++;
      } else {
        processedResults.push({ ...result, count: 1 });
        lastUnchangedIndex = index;
      }
    } else {
      processedResults.push({ ...result, count: 1 });
      lastUnchangedIndex = null;
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">File Comparison Tool</h1>
      <Button onClick={handleCompare} className="mb-4">
        Compare Files
      </Button>

      <div className="space-y-4">
        {processedResults.map((item, index) =>
          item.type === ComparisonResultType.Unchanged ? (
            <UnChangedCard key={index} count={item.count} />
          ) : (
            <ComparisonCard key={index} comparison={item} />
          )
        )}
      </div>
    </div>
  );
};
