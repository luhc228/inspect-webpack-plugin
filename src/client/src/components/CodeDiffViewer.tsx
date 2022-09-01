import ReactDiffViewer from 'react-diff-viewer';

interface CodeDiffViewerProps {
  oldCode: string;
  newCode: string;
}

const customStyles = {
  variables: {
    dark: {
      diffViewerBackground: '#1d1d1d',
      addedBackground: '#1a3022',
      addedGutterBackground: '#191919',
      removedGutterBackground: '#191919',
      wordAddedBackground: '#27633d',
      emptyLineBackground: '#1d1d1d',
      gutterBackground: '#191919',
    },
  },
  diffContainer: {
    lineHeight: 0,
  },
  line: {
    fontSize: '12px',
  },
  wordDiff: {
    padding: 0,
  },
};
export default function CodeDiffViewer({ oldCode, newCode }: CodeDiffViewerProps) {
  return (
    <ReactDiffViewer
      styles={customStyles}
      oldValue={oldCode}
      newValue={newCode}
      useDarkTheme
      splitView
    />
  );
}
