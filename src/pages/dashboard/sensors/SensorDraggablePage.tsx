import { Box, Typography } from '@mui/material';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import clsx from 'clsx';
import ColoredButton from 'components/ColoredButton';
import { SensorContext } from 'context/SensorContext';
import { isBefore } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import {
  ReactZoomPanPinchRef,
  ReactZoomPanPinchState,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';
import ColorsEnum from 'types/ColorsEnum';
import Sensor, { SensorId } from 'types/Sensor';
import SensorNow from './components/SensorNow';

const dimensionConfig = {
  elemConfig: {
    width: 350,
    height: 250,
  },
  previewConfig: {
    width: 180,
    height: 115,
  },
};

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
      margin: '10px',
      backgroundColor: ColorsEnum.BGDARK,
      width: '100%',
      marginRight: '200px',
    },
    rightbar: {
      height: '100vh',
      width: '100vw', // make it 100% wide so we don't have to "pop out of hidden overflow" when dragging
      overflow: 'auto',
      position: 'fixed',
      right: '0',
      top: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    innerRightbar: {
      backgroundColor: ColorsEnum.BGLIGHTER,
      padding: '5px 0px 0px 0px',
      minHeight: '100vh',
      height: '100%',
    },
    rightbarItem: {
      borderWidth: '5px 10px 5px 10px',
      borderColor: ColorsEnum.BGLIGHTER,
      boxSizing: 'content-box',
      borderStyle: 'solid',
    },
    absolute: {
      position: 'absolute',
      zIndex: '10000000!important',
    },
    relative: {
      position: 'relative',
    },
    fullWidth: {
      width: '100%!important',
    },
    fullHeight: {
      height: 'calc(100vh - 20px)!important',
    },
    highZIndex: {
      zIndex: '10000!important',
    },
    boardItem: {
      position: 'fixed',
      left: 0,
      top: 0,
    },
  });

const SensorDraggablePage: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const sensorContext = useContext(SensorContext);

  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const rightbarRef = useRef<HTMLDivElement>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  const boardPositionState = (): ReactZoomPanPinchState => {
    return (
      transformRef.current?.state || {
        scale: 1,
        previousScale: 1,
        positionX: 0,
        positionY: 0,
      }
    );
  };

  useEffect(() => {
    const fetch = async () => {
      await sensorContext.listMySensors();
    };
    fetch();
  }, []);

  const sidebarSensors = () => {
    return sensorContext.mySensors
      .filter((s) => !s.isPinned)
      .sort((a, b) => {
        if (!a.lastSeenAt) {
          return 1;
        }
        if (isBefore(a.lastSeenAt, b.lastSeenAt)) {
          return 1;
        }
        return -1;
      });
  };

  const pinnedSensors = () => sensorContext.mySensors.filter((s) => s.isPinned);

  // metadata about the unpinned drag
  const [dragMetadata, setDragMetadata] = useState<{
    x?: number; // offset of the top left point of the box
    y?: number;
    innerOffsetX?: number; // left offset within the draggable
    innerOffsetY?: number; // top offset within the draggable
    id?: SensorId;
  }>();

  const board = {
    scale: 1,
    boardX: 0,
    boardY: 0,
  };

  const [insideRightbar, setInsideRightbar] = useState<boolean>(false);

  const updateSensor = (id: SensorId, newData: Partial<Sensor>) => {
    // TODO API

    const sensorToUpdate = sensorContext.mySensors.find((s) => s.id === id);
    sensorToUpdate.offsetX = newData.offsetX ?? sensorToUpdate.offsetX;
    sensorToUpdate.offsetY = newData.offsetY ?? sensorToUpdate.offsetY;
    sensorToUpdate.isPinned = newData.isPinned ?? sensorToUpdate.isPinned;
  };

  const updateCanvas = () => {
    // TODO API
    const update = {
      scale: boardPositionState().scale,
      boardX: boardPositionState().positionX,
      boardY: boardPositionState().positionY,
    };
  };

  // where in the board have we clicked - x and y
  const getClickCoordinates = (e: MouseEvent) => ({
    x: e.pageX - boardContainerRef.current.offsetLeft,
    y: e.pageY - boardContainerRef.current.offsetTop,
  });

  const onUnpinnedDragStop = (e: DraggableEvent, item: Sensor) => {
    if (!dragMetadata) {
      return;
    }

    const clickCoordinates = getClickCoordinates(e as any);
    const dropPosition = {
      ...clickCoordinates,
      id: item.id,
      innerOffsetX: dragMetadata.innerOffsetX,
      innerOffsetY: dragMetadata.innerOffsetY,
    };

    const {
      scale,
      positionX, // top left x of visible board
      positionY,
    } = boardPositionState();

    let defaultX = (-positionX + dropPosition.x) / scale;
    let defaultY = (-positionY + dropPosition.y) / scale;

    // scale the inner offsets by ration preview/actual item
    defaultX -=
      dropPosition.innerOffsetX *
      (dimensionConfig.elemConfig.width / dimensionConfig.previewConfig.width);
    defaultY -=
      dropPosition.innerOffsetY *
      (dimensionConfig.elemConfig.height / dimensionConfig.previewConfig.height);

    updateSensor(dropPosition.id, {
      offsetX: Math.ceil(defaultX),
      offsetY: Math.ceil(defaultY),
      isPinned: true,
    });

    setDragMetadata(null);
    setInsideRightbar(false);
  };

  const onUnpinnedDrag = (e: DraggableEvent, data: DraggableData, item: Sensor) => {
    // this will be called multiple times, so only acknowledge the first time around
    if (dragMetadata) {
      return;
    }

    const parentScrollTop = data.node.parentElement.parentElement.parentElement.scrollTop;
    const parentOffsetLeft = data.node.offsetLeft;
    const parentOffsetTop = data.node.offsetTop - parentScrollTop; // subtract what we've scrolled

    const innerOffsetX =
      (e as MouseEvent).pageX -
      window.innerWidth +
      rightbarRef.current.clientWidth -
      parentOffsetLeft;

    const innerOffsetY =
      (e as MouseEvent).pageY -
      window.innerHeight +
      rightbarRef.current.clientHeight -
      parentOffsetTop;

    setDragMetadata({
      x: parentOffsetLeft + 10, // account for padding
      y: parentOffsetTop + 10,
      innerOffsetX,
      innerOffsetY,
      id: item.id,
    });
  };

  return (
    <div className={classes.container}>
      {sensorContext.mySensors.length === 0 && (
        <Box style={{ textAlign: 'center', marginTop: '50px' }}>
          <Typography variant="h4">No sensors found. Try adding some.</Typography>
        </Box>
      )}
      <div className={classes.root} ref={boardContainerRef}>
        <TransformWrapper
          ref={transformRef}
          initialScale={board?.scale}
          minScale={0.1}
          maxScale={2.5}
          doubleClick={{
            disabled: true,
          }}
          limitToBounds={false}
          zoomAnimation={{ disabled: false }}
          centerOnInit={false}
          alignmentAnimation={{
            disabled: false,
            sizeX: 0,
            sizeY: 0,
          }}
          // panning === moving
          panning={{
            excluded: ['panning-disabled'],
          }}
          onZoomStop={updateCanvas}
          onPinchingStop={updateCanvas}
          onPanningStop={updateCanvas}
          onWheelStop={updateCanvas}
          initialPositionX={board?.boardX}
          initialPositionY={board?.boardY}
          wheel={{
            step: 0.1,
          }}
        >
          {() => (
            <TransformComponent
              wrapperClass={clsx(classes.fullWidth, classes.fullHeight)}
              contentClass={clsx(classes.fullWidth, classes.fullHeight)}
            >
              {pinnedSensors().map((s: Sensor) => (
                <ContextMenuTrigger id={s.id} key={s.id}>
                  <Draggable
                    key={s.id}
                    onDrag={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onStop={(e, data) => {
                      updateSensor(s.id, {
                        offsetX: Math.floor(data.x),
                        offsetY: Math.floor(data.y),
                      });
                    }}
                    scale={boardPositionState().scale}
                    defaultPosition={{
                      x: s.offsetX,
                      y: s.offsetY,
                    }}
                  >
                    <div className={classes.boardItem}>
                      <SensorNow
                        sensor={s}
                        width={dimensionConfig.elemConfig.width}
                        height={dimensionConfig.elemConfig.height}
                      />
                    </div>
                  </Draggable>
                </ContextMenuTrigger>
              ))}
            </TransformComponent>
          )}
        </TransformWrapper>
      </div>
      <div
        className={classes.rightbar}
        ref={rightbarRef}
        style={{
          pointerEvents: insideRightbar ? 'auto' : 'none', // only allow events when we're actively inside the right bar
        }}
      >
        <div
          className={classes.innerRightbar}
          onMouseEnter={() => setInsideRightbar(true)}
          onMouseLeave={() => setInsideRightbar(false)}
        >
          {sidebarSensors().map((s) => (
            <div className={classes.rightbarItem} key={s.id}>
              <Draggable
                position={{ x: 0, y: 0 }}
                defaultClassName={`${classes.highZIndex} 
            `}
                onDrag={(e, data) => onUnpinnedDrag(e, data, s)}
                onStop={(e, data) => onUnpinnedDragStop(e, s)}
              >
                <SensorNow
                  sensor={s}
                  key={s.id}
                  width={dimensionConfig.previewConfig.width - 30} // minus the border
                  height={dimensionConfig.previewConfig.height - 34}
                  hideMeasurements
                />
              </Draggable>
            </div>
          ))}
        </div>
      </div>
      {pinnedSensors().map((s: Sensor) => (
        <ContextMenu id={s.id} key={s.id}>
          <MenuItem onClick={() => updateSensor(s.id, { isPinned: false })}>
            <ColoredButton colorVariety={ColorsEnum.BLUE}>Remove item</ColoredButton>
          </MenuItem>
        </ContextMenu>
      ))}
    </div>
  );
};

export default withStyles(styles)(observer(SensorDraggablePage));
