export type TransformMap = Record<string, TransformInfo[]>;

interface TransformInfo {
  name: string;
  result: string;
  // start: number;
  // end: number;
}