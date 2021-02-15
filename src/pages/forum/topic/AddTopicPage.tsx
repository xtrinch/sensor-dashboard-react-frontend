import Container from "@material-ui/core/Container";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ColoredButton from "components/ColoredButton";
import TextInput from "components/TextInput";
import TopBar from "components/TopBar";
import { TopicContext } from "context/TopicContext";
import { useFormik } from "formik";
import WYSIGEditor from "pages/forum/components/WYSIGEditor";
import { getTopicListRoute } from "pages/forum/ForumRoutes";
import React, { useContext, useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { RouteComponentProps, withRouter } from "react-router";
import TopicService from "services/TopicService";
import ColorsEnum from "types/ColorsEnum";
import Topic from "types/Topic";

const styles = (theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(30),
      topic: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "15px",
    },
  });

const AddTopicPage: React.FunctionComponent<
  WithStyles<typeof styles> &
    RouteComponentProps<{ id: string; topicId: string }>
> = (props) => {
  const {
    classes,
    history,
    match: { params },
  } = props;

  const [topic, setTopic] = useState(
    () => new Topic({ categoryId: params.id })
  );

  const { addTopic, updateTopic } = useContext(TopicContext);

  const submitForm = async (values: Topic, { setStatus }) => {
    try {
      let newTopic;
      if (isEdit()) {
        newTopic = await updateTopic(topic.id, values);
      } else {
        newTopic = await addTopic(values);
      }

      if (newTopic) {
        history.push(getTopicListRoute(parseInt(params.id)));
      }
    } catch (e) {
      setStatus(e);
    }
  };

  const formik = useFormik<Topic>({
    initialValues: topic,
    onSubmit: submitForm,
    enableReinitialize: true,
  });

  const isEdit = () => {
    return !!params.topicId;
  };

  useEffect(() => {
    const setData = async () => {
      if (isEdit()) {
        const s = await TopicService.getTopic(parseInt(params.topicId));
        setTopic(s);
      }
    };
    setData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <TopBar
        alignItems="center"
        backEnabled
        backTo={getTopicListRoute(parseInt(params.id))}
        color={ColorsEnum.OLIVE}
      >
        <Typography component="h1" variant="h4">
          {isEdit() ? "Edit" : "Add"} topic
        </Typography>
      </TopBar>
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <form noValidate onSubmit={formik.handleSubmit}>
            <TextInput
              id="name"
              margin="normal"
              label="Name"
              name="name"
              value={formik.values.name}
              autoFocus
              onChange={formik.handleChange}
              error={!!formik.status?.name}
              helperText={formik.status?.name}
              fullWidth
            />
            <WYSIGEditor
              editorState={formik.values.description}
              onEditorStateChange={(value) =>
                formik.setFieldValue("description", value)
              }
            />
            <ColoredButton
              type="submit"
              style={{ marginTop: "20px" }}
              colorVariety={ColorsEnum.OLIVE}
            >
              Submit
            </ColoredButton>
          </form>
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(AddTopicPage));
