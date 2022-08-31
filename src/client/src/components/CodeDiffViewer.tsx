import ReactDiffViewer from 'react-diff-viewer';

interface CodeDiffViewerProps {
  oldCode: string;
  newCode: string;
}

export default function CodeDiffViewer({ oldCode, newCode }: CodeDiffViewerProps) {
  return (
    <ReactDiffViewer
      oldValue={oldCode}
      newValue={newCode}
      useDarkTheme
      splitView
    />
  );
}
