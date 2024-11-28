export interface FileSection {
  header: string;
  content: string;
}

// Comparison result types
export enum ComparisonResultType {
  Unchanged = "unchanged",
  Modified = "modified",
  Added = "added",
  Deleted = "deleted",
}

export interface ComparisonResult {
  type: ComparisonResultType;
  section: FileSection;
  originalSection?: FileSection;
  count?: number; // For unchanged sections
}

// Word diff types
export enum DiffWordType {
  Unchanged = "unchanged",
  Added = "added",
  Removed = "removed",
}

export interface DiffWord {
  text: string;
  type: DiffWordType;
}
