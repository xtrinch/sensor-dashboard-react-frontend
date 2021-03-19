import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsInputAntennaIcon from "@material-ui/icons/SettingsInputAntenna";
import ColoredButton from "components/ColoredButton";
import SelectInput from "components/SelectInput";
import TextInput from "components/TextInput";
import TopBar from "components/TopBar";
import { openConfirmation } from "context/ConfirmationContext";
import { ForwarderContext } from "context/ForwarderContext";
import { format } from "date-fns";
import { DashboardRoutes } from "pages/dashboard/DashboardRoutes";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import ForwarderService from "services/ForwarderService";
import BoardTypeEnum from "types/BoardTypeEnum";
import ColorsEnum from "types/ColorsEnum";
import Forwarder, { ForwarderId } from "types/Forwarder";
import { DATETIME_REGEX } from "utils/date.range";

const styles = (theme) =>
  createStyles({
    paper: {
      marginTop: "30px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: "30px",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      padding: theme.spacing(6, 0, 6),
    },
    actionButton: {
      backgroundColor: ColorsEnum.ERROR,
      color: ColorsEnum.WHITE,
    },
    action: {
      position: "absolute",
      right: "25px",
      bottom: "25px",
    },
  });

const ForwarderInfoPage: React.FunctionComponent<
  WithStyles<typeof styles> & RouteComponentProps<{ id: string }>
> = (props) => {
  const {
    classes,
    match: {
      params: { id },
    },
    history,
  } = props;

  const { deleteForwarder, updateForwarder } = useContext(ForwarderContext);

  const errs: { [key: string]: string } = {};
  const [errors, setErrors] = useState(errs);
  const [data, setData] = useState({
    name: "",
    location: "",
    boardType: "" as BoardTypeEnum,
  });

  const [forwarder, setForwarder] = useState(null);

  const deleteWithConfirmation = () => {
    const onConfirm = async () => {
      await deleteForwarder(forwarder.id);
      history.push(DashboardRoutes.FORWARDER_LIST);
    };
    openConfirmation(
      onConfirm,
      null,
      "Are you sure you want to delete forwarder?"
    );
  };

  useEffect(() => {
    const getForwarder = async () => {
      const s = await ForwarderService.getForwarder(
        (id as unknown) as ForwarderId
      );
      setForwarder(s);
      setData((d) => ({
        ...d,
        name: s.name,
        location: s.location,
        boardType: s.boardType,
      }));
    };

    getForwarder();
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      await updateForwarder(
        (id as unknown) as ForwarderId,
        new Forwarder(data)
      );
    } catch (e) {
      setErrors(e);
    }
  };

  const fieldChange = (val, fieldName) => {
    data[fieldName] = val;
    setData({ ...data });
  };

  return (
    <>
      <TopBar alignItems="flex-end">
        <ColoredButton
          startIcon={<DeleteIcon />}
          onClick={deleteWithConfirmation}
          colorVariety={ColorsEnum.BLUE}
          size="small"
        >
          Delete
        </ColoredButton>
      </TopBar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <SettingsInputAntennaIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forwarder board info
          </Typography>
          <form className={classes.form} noValidate onSubmit={submitForm}>
            <TextInput
              variant="outlined"
              margin="normal"
              fullWidth
              id="accessToken"
              name="accessToken"
              label="Forwarder access token"
              disabled
              value={forwarder?.accessToken || ""}
            />
            <TextInput
              variant="outlined"
              margin="normal"
              fullWidth
              id="accessToken"
              name="accessToken"
              label="Last seen at"
              disabled
              value={
                forwarder?.lastSeenAt
                  ? format(forwarder?.lastSeenAt, DATETIME_REGEX)
                  : "Never"
              }
            />
            <TextInput
              variant="outlined"
              margin="normal"
              fullWidth
              id="numForwarded"
              name="numForwarded"
              label="Number of forwarded packets"
              disabled
              type="number"
              value={forwarder?.numForwarded || 0}
            />
            <TextInput
              variant="outlined"
              margin="normal"
              fullWidth
              id="name"
              label="Forwarder name"
              name="name"
              value={data.name}
              onChange={(e) => fieldChange(e.target.value, "name")}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextInput
              variant="outlined"
              margin="normal"
              fullWidth
              name="location"
              label="Location description"
              type="location"
              id="location"
              autoComplete="current-location"
              value={data.location}
              onChange={(e) => fieldChange(e.target.value, "location")}
              error={!!errors.location}
              helperText={errors.location}
            />
            <SelectInput
              id="boardType"
              value={data.boardType}
              fullWidth
              options={Object.keys(BoardTypeEnum)}
              onChange={(e, newVal) => fieldChange(newVal, "boardType")}
              label="Board type"
              variant="outlined"
              margin="normal"
              error={!!errors.boardType}
              helperText={errors.boardType}
            />
            <ColoredButton
              type="submit"
              fullWidth
              style={{ marginTop: "20px" }}
              colorVariety={ColorsEnum.BLUE}
            >
              Update
            </ColoredButton>
          </form>
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(ForwarderInfoPage));
