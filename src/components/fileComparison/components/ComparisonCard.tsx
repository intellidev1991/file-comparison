import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ComparisonResult,
  ComparisonResultType,
  DiffWordType,
} from "@/tools/fileParse.types";
import { diffWords } from "@/tools/fileParse";

interface ComparisonCardProps {
  comparison: ComparisonResult;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  comparison,
}) => {
  const renderDiffContent = () => {
    if (comparison.type === ComparisonResultType.Deleted)
      return <p className="text-red-600">{comparison.section.content}</p>;

    if (comparison.type === ComparisonResultType.Added)
      return <p className="text-green-600">{comparison.section.content}</p>;

    // Modified case (original + modified words)
    if (
      comparison.originalSection &&
      comparison.type === ComparisonResultType.Modified
    ) {
      const totalWordDiffs = diffWords(
        comparison.originalSection.content,
        comparison.section.content
      );

      return (
        <div className="flex flex-wrap">
          {totalWordDiffs.map((word, index) => (
            <span
              key={index}
              className={
                word.type === DiffWordType.Removed
                  ? "text-red-600 line-through mr-1"
                  : word.type === DiffWordType.Added
                  ? "text-green-600 mr-1"
                  : "mr-1"
              }
            >
              {word.text}
            </span>
          ))}
        </div>
      );
    }

    return null;
  };

  const getCardTitle = () => {
    switch (comparison.type) {
      case ComparisonResultType.Modified:
        return `${comparison.section.header}`;
      case ComparisonResultType.Added:
        return (
          <span className="text-green-600">{`[+] ${comparison.section.header}`}</span>
        );
      case ComparisonResultType.Deleted:
        return (
          <span className="text-red-600">{`[-] ${comparison.section.header}`}</span>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getCardTitle()}</CardTitle>
      </CardHeader>
      <CardContent>{renderDiffContent()}</CardContent>
    </Card>
  );
};
