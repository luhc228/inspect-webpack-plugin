export type TransformMap = Record<string, TransformInfo[]>;

export interface TransformInfo {
  name: string;
  result: string;
  start: number;
  end: number;
}