import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React from 'react';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import * as Showdown from 'showdown';
import ColorsEnum from 'types/ColorsEnum';

const styles = (theme) =>
  createStyles({
    reactMde: {
      backgroundColor: 'transparent',
      border: (props: WYSIGEditorProps) =>
        props.readOnly ? undefined : '1px solid rgba(255, 255, 255, 0.12)',
      borderWidth: '0px',
      width: '100%',
    },
    preview: {
      borderWidth: '0px',
      textAlign: 'left',
      '& pre': {
        backgroundColor: `${ColorsEnum.BGDARK}!important`,
      },
      '& blockquote': {
        color: 'white!important',
      },
    },
    textArea: {
      backgroundColor: ColorsEnum.BGLIGHTER,
      color: 'white',
      borderWidth: '0px',
      outline: 'none',
    },
    editor: {
      backgroundColor: 'transparent',
      minHeight: (props: WYSIGEditorProps) => (props.readOnly ? undefined : '300px'),
      padding: '0px 15px',
      overflow: 'visible',
    },
    toolbar: {
      display: (props: WYSIGEditorProps) => (props.readOnly ? 'none' : undefined),
      backgroundColor: ColorsEnum.BGLIGHTER,
      borderWidth: '0px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      color: 'white!important',
      '& button': {
        color: 'white!important',
      },
    },
  });

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});
interface WYSIGEditorProps {
  editorState?: string;
  onEditorStateChange?: (change: string) => void;
  readOnly?: boolean;
}

const WYSIGEditor: React.FunctionComponent<WithStyles<typeof styles> & WYSIGEditorProps> = (
  props,
) => {
  const { classes, editorState, onEditorStateChange, readOnly } = props;

  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    readOnly ? 'preview' : 'write',
  );

  return (
    <ReactMde
      value={editorState}
      onChange={onEditorStateChange}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
      readOnly={readOnly}
      classes={{
        reactMde: classes.reactMde,
        toolbar: classes.toolbar,
        preview: classes.preview,
        textArea: classes.textArea,
      }}
    />
  );
};

export default withStyles(styles)(WYSIGEditor);
