export type ExecutedToolResult = {
  ok: boolean;
  tool: string;
  summary: string;
  data?: unknown;
  changedPaths?: string[];
  preview?: unknown;
};
