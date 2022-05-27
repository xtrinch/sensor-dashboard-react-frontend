import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import OpacityIcon from '@mui/icons-material/Opacity';
import { Box, ClickAwayListener, Typography } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import ColoredButton from 'components/ColoredButton';
import { DisplayContext } from 'context/DisplayContext';
import { fabric } from 'fabric';
import { debounce, isEqual } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Draggable, { DraggableEvent } from 'react-draggable';
import { useParams } from 'react-router';
import DisplayService from 'services/DisplayService';
import ColorsEnum from 'types/ColorsEnum';
import Display, { DisplayId } from 'types/Display';
import Sensor from 'types/Sensor';
import {
  addBorderRect,
  addHumidity,
  additionalPropertiesToSave,
  addTemperature,
  addText,
  addWall,
  Metadata,
  useFabric,
} from './SensorDraggablePage.utils';

interface CanvasItem {
  id: string;
}

const styles = (theme) =>
  createStyles({
    container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
    },
    root: {
      height: 'calc(100vh - 20px)',
      backgroundColor: ColorsEnum.BGDARK,
      width: '100%',
    },
    absolute: {
      position: 'absolute',
      zIndex: '10000000!important',
    },
    relative: {
      position: 'relative',
    },
    highZIndex: {
      zIndex: '10000!important',
    },
    bottomBar: {
      backgroundColor: ColorsEnum.GRAYDARK,
      position: 'fixed',
      bottom: 0,
      right: 0,
      left: '270px',
      display: 'flex',
      flexDirection: 'row',
      padding: '10px 10px 3px 10px',
      '&>div': {
        paddingRight: '10px',
        cursor: 'pointer',
      },
      '& svg': {
        fontSize: '26px',
      },
    },
    rightclick: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
    },
  });

const SensorDraggablePage: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const displayStore = useContext(DisplayContext);

  const [display, setDisplay] = useState<Display>(null);
  const params = useParams<{ id: DisplayId }>();

  const [canvas, setCanvas] = useState<fabric.Canvas>(null);

  const boardContainerRef = useRef<HTMLDivElement>(null);

  const canvasConfig = {
    innerWidth: 420,
    innerHeight: 380,
    width: window.innerWidth - 270,
    height: window.innerHeight,
  };

  const onObjectModified = (canv: fabric.Canvas) => {
    const newState = canv?.toJSON(additionalPropertiesToSave);

    if (newState && !isEqual(newState, display?.state)) {
      displayStore.updateDisplay(
        params.id,
        {
          ...display,
          state: newState as any,
        },
        true,
      );
    }
  };

  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
    visible: false,
    target: null,
  });
  const onRightClick = (coordinates: { x: number; y: number }, target: fabric.Group) => {
    setCoords({
      x: coordinates.x,
      y: coordinates.y,
      visible: true,
      target,
    });
  };

  const canvasRef = useFabric(
    (fabricCanvas: fabric.Canvas) => {
      if (!display) {
        return null;
      }

      setCanvas(fabricCanvas);
      addBorderRect(
        fabricCanvas,
        canvasConfig.width,
        canvasConfig.height,
        canvasConfig.innerWidth,
        canvasConfig.innerHeight,
      );
      if (Object.keys(display?.state).length !== 0 && display?.state.objects?.length !== 0) {
        fabricCanvas.loadFromJSON(display.state, () => {});
      }
      fabricCanvas.on(
        'after:render',
        debounce(() => onObjectModified(fabricCanvas), 1000),
      );
      return fabricCanvas;
    },
    {
      // plus oversize because we want to be able to see the handles
      width: canvasConfig.width,
      height: canvasConfig.height,
    },
    onRightClick,
    [display],
  );

  // metadata about the unpinned drag
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const onUnpinnedItemDragStop = (e: DraggableEvent, item: CanvasItem) => {
    const pointer = canvas.getPointer(e as any);
    switch (item.id) {
      case 'wall':
        addWall(canvas, pointer.x, pointer.y);
        break;
      case 'text':
        addText(canvas, pointer.x, pointer.y);
        break;
      case 'temperature':
        addTemperature(canvas, pointer.x, pointer.y);
        break;
      case 'humidity':
        addHumidity(canvas, pointer.x, pointer.y);
        break;
      default:
        break;
    }
    setIsDragging(false);
  };

  // this will be called multiple times, so only acknowledge the first time around
  const onUnpinnedItemDrag = () => {
    if (isDragging) return;
    setIsDragging(true);
  };

  const onSensorSelect = (s: Sensor) => {
    (coords.target as fabric.Group & Metadata).sensorId = s.id;
    setCoords({ x: 0, y: 0, visible: false, target: null });
  };

  useEffect(() => {
    const fetch = async () => {
      const s = await DisplayService.getDisplay(params.id as unknown as DisplayId);
      setDisplay(s);
    };

    fetch();
  }, [params.id]);

  if (!display) {
    return null;
  }

  return (
    <div className={classes.container}>
      {display?.sensors.length === 0 && (
        <Box style={{ textAlign: 'center', marginTop: '50px' }}>
          <Typography variant="h4">No sensors found. Try adding some.</Typography>
        </Box>
      )}
      {display && (
        <div className={classes.root} ref={boardContainerRef}>
          <canvas id="canvas" ref={canvasRef} />
        </div>
      )}
      <div className={classes.bottomBar}>
        {[
          { id: 'wall', icon: <HorizontalRuleIcon /> },
          { id: 'text', icon: <FormatColorTextIcon /> },
          { id: 'temperature', icon: <DeviceThermostatIcon /> },
          { id: 'humidity', icon: <OpacityIcon /> },
        ].map((item, index) => (
          <Draggable
            key={index}
            position={{ x: 0, y: 0 }}
            defaultClassName={`${classes.highZIndex} 
            `}
            onDrag={onUnpinnedItemDrag}
            onStop={(e) => onUnpinnedItemDragStop(e, item)}
          >
            <div>{item.icon} </div>
          </Draggable>
        ))}
      </div>
      <ClickAwayListener
        onClickAway={() => setCoords({ x: 0, y: 0, visible: false, target: null })}
      >
        <div
          className={classes.rightclick}
          style={{
            left: 270 + coords.x,
            top: coords.y,
            display: coords.visible ? 'flex' : 'none',
          }}
        >
          {display?.sensors.map((s: Sensor) => (
            <ColoredButton
              colorVariety={coords.target?.sensorId === s.id ? ColorsEnum.GREEN : ColorsEnum.BLUE}
              size="small"
              onClick={() => onSensorSelect(s)}
            >
              {s.name}
            </ColoredButton>
          ))}
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default withStyles(styles)(observer(SensorDraggablePage));
