import Container from '@material-ui/core/Container';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Delete } from '@material-ui/icons';
import ColoredButton from 'components/ColoredButton';
import SelectInput from 'components/SelectInput';
import TextInput from 'components/TextInput';
import TopBar from 'components/TopBar';
import { openConfirmation } from 'context/ConfirmationContext';
import { RadioContext } from 'context/RadioContext';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { DashboardRoutes } from 'pages/dashboard/DashboardRoutes';
import React, { useContext, useEffect, useState } from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';
import { RouteComponentProps, withRouter } from 'react-router';
import RadioService from 'services/RadioService';
import BoardTypeEnum from 'types/BoardTypeEnum';
import ColorsEnum from 'types/ColorsEnum';
import Radio from 'types/Radio';
import { DATETIME_REGEX } from 'utils/date.range';

const styles = (theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(30),
      radio: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: ColorsEnum.BGLIGHT,
      padding: '15px',
    },
  });

const AddRadioPage: React.FunctionComponent<WithStyles<typeof styles> & RouteComponentProps<{ id: string }>> = (
  props
) => {
  const {
    classes,
    history,
    match: { params },
  } = props;

  const [radio, setRadio] = useState(() => new Radio({}));
  const { addRadio, updateRadio, deleteRadio, sendConfig, readConfig } = useContext(RadioContext);

  const isEdit = () => {
    return !!params.id;
  };

  const submitForm = async (values: Radio, { setStatus }) => {
    try {
      let newRadio;
      if (isEdit()) {
        newRadio = await updateRadio(radio.id, values);
      } else {
        newRadio = await addRadio(values);
      }

      if (newRadio && !isEdit()) {
        history.push(DashboardRoutes.RADIO_LIST);
      }
    } catch (e) {
      console.log(e);
      setStatus(e);
    }
  };

  const formik = useFormik<Radio>({
    initialValues: radio,
    onSubmit: submitForm,
    enableReinitialize: true,
  });

  useEffect(() => {
    const setData = async () => {
      if (isEdit()) {
        const s = await RadioService.getRadio(params.id);
        setRadio(s);
      }
    };
    setData();
  }, []);

  const deleteWithConfirmation = () => {
    const onConfirm = async () => {
      await deleteRadio(radio.id);
      history.push('/');
    };
    openConfirmation(onConfirm, null, 'Are you sure you want to delete radio?');
  };

  const requestConfigWithConfirmation = () => {
    const onConfirm = async () => {
      await readConfig(radio.id);
    };
    openConfirmation(
      onConfirm,
      null,
      'Are you sure you want to request configuration from radio? Existing cloud configuration will be overwritten.'
    );
  };

  const sendConfigWithConfirmation = () => {
    const onConfirm = async () => {
      await updateRadio(radio.id, formik.values);
      await sendConfig(radio.id);
    };
    openConfirmation(onConfirm, null, 'Are you sure you want to send config to the radio?');
  };

  return (
    <>
      <TopBar alignItems="center" backEnabled backTo={DashboardRoutes.RADIO_LIST} color={ColorsEnum.BLUE}>
        <Typography component="h1" variant="h4" style={{ marginRight: '20px' }}>
          {isEdit() ? 'Edit' : 'Add'} radio
        </Typography>
        {isEdit() && (
          <>
            <ColoredButton
              startIcon={<Delete />}
              onClick={requestConfigWithConfirmation}
              colorVariety={ColorsEnum.BLUE}
              size="small"
              style={{ marginRight: '20px' }}
            >
              Read config
            </ColoredButton>
            <ColoredButton
              startIcon={<Delete />}
              onClick={sendConfigWithConfirmation}
              colorVariety={ColorsEnum.BLUE}
              size="small"
              style={{ marginRight: '20px' }}
            >
              Send config
            </ColoredButton>
            <ColoredButton
              startIcon={<Delete />}
              onClick={deleteWithConfirmation}
              colorVariety={ColorsEnum.ERROR}
              size="small"
            >
              Delete
            </ColoredButton>
          </>
        )}
      </TopBar>
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
          <form noValidate onSubmit={formik.handleSubmit}>
            {isEdit() && (
              <>
                <TextInput
                  id="accessToken"
                  name="accessToken"
                  label="Sensor access token"
                  disabled
                  value={radio?.accessToken || ''}
                  fullWidth
                />
                <TextInput
                  id="accessToken"
                  name="accessToken"
                  label="Last seen at"
                  disabled
                  value={radio?.lastSeenAt ? format(radio?.lastSeenAt, DATETIME_REGEX) : 'Never'}
                  fullWidth
                />
              </>
            )}
            <TextInput
              id="name"
              label="Name"
              value={formik.values.name}
              autoFocus
              onChange={formik.handleChange}
              error={!!formik.status?.name}
              helperText={formik.status?.name}
              fullWidth
            />
            <TextInput
              id="location"
              label="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={!!formik.status?.location}
              helperText={formik.status?.location}
              fullWidth
            />
            <SelectInput
              value={formik.values.boardType || null}
              onChange={(e, newVal) => formik.setFieldValue('boardType', newVal)}
              options={Object.keys(BoardTypeEnum)}
              label="Board type"
              error={!!formik.status?.boardType}
              helperText={formik.status?.boardType}
            />
            {/* <TextInput
              id="config"
              label="Config"
              multiline={true}
              rows={10}
              value={formik.values.config}
              onChange={formik.handleChange}
              error={!!formik.status?.config}
              helperText={formik.status?.config}
              fullWidth
            /> */}
            <Typography variant="body2">Config</Typography>
            {formik.values.config && (
              <ReactJson
                src={formik.values.config}
                theme="monokai"
                onEdit={(edit: InteractionProps) => {
                  formik.setFieldValue('config', edit.updated_src);
                }}
                onAdd={(edit: InteractionProps) => {
                  formik.setFieldValue('config', edit.updated_src);
                }}
                onDelete={(edit: InteractionProps) => {
                  formik.setFieldValue('config', edit.updated_src);
                }}
                enableClipboard={false}
                collapsed={false}
                displayObjectSize={false}
                displayDataTypes={false}
                defaultValue={''}
                style={{ marginTop: '5px', padding: '10px' }}
              />
            )}
            <ColoredButton type="submit" style={{ marginTop: '20px' }} colorVariety={ColorsEnum.BLUE}>
              Submit
            </ColoredButton>
          </form>
        </div>
      </Container>
    </>
  );
};

export default withRouter(withStyles(styles)(AddRadioPage));
