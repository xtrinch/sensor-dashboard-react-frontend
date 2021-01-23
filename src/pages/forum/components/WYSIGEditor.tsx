import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { EditorState } from "draft-js";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ColorsEnum from "types/ColorsEnum";

const styles = (theme) =>
  createStyles({
    wrapper: {
      backgroundColor: "transparent",
      border: (props: WYSIGEditorProps) =>
        props.readOnly ? undefined : "1px solid rgba(255, 255, 255, 0.12)",
      flex: "1",
    },
    editor: {
      backgroundColor: "transparent",
      minHeight: (props: WYSIGEditorProps) =>
        props.readOnly ? undefined : "300px",
      padding: "0px 15px",
      overflow: "visible",
    },
    toolbar: {
      display: (props: WYSIGEditorProps) =>
        props.readOnly ? "none" : undefined,
      backgroundColor: ColorsEnum.BGLIGHTER,
      borderWidth: "0px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
      "& .rdw-option-wrapper, .rdw-dropdown-wrapper": {
        backgroundColor: ColorsEnum.GRAYDARK,
        borderWidth: "0px",
        color: "white",
      },
    },
  });

interface WYSIGEditorProps {
  editorState: EditorState;
  onEditorStateChange?: (change: EditorState) => void;
  readOnly?: boolean;
  style?: CSSProperties;
}

const WYSIGEditor: React.FunctionComponent<
  WithStyles<typeof styles> & WYSIGEditorProps
> = (props) => {
  const { classes, editorState, onEditorStateChange, readOnly } = props;

  return (
    <Editor
      editorState={editorState}
      toolbarClassName={classes.toolbar}
      editorClassName={classes.editor}
      onEditorStateChange={onEditorStateChange}
      wrapperClassName={classes.wrapper}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "fontSize",
          "fontFamily",
          "list",
          "textAlign",
          "colorPicker",
          "link",
          "embedded",
          "emoji",
          "image",
          "remove",
          "history",
        ],
        inline: {
          options: [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "monospace",
          ],
        },
      }}
      readOnly={readOnly}
    />
  );
};

export default withStyles(styles)(WYSIGEditor);
