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
      // flex: '1',
    },
    rightbar: {
      height: '100vh',
      width: '100vw',
      overflow: 'auto',
      position: 'fixed',
      right: '0',
      top: '0',
      // width: '300px',
      // minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      // '& >div': {
      //   marginBottom: '10px',
      // },
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
    canvasItem: {
      position: 'fixed',
      left: 0,
      top: 0,
    },
  });

const SensorCanvasPage: React.FunctionComponent<WithStyles<typeof styles>> = (props) => {
  const { classes } = props;

  const sensorContext = useContext(SensorContext);

  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const rightbarRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const canvasPositionState = (): ReactZoomPanPinchState => {
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

  // metadata about the preview drag, relative to popover container
  const [dragPosition, setDragPosition] = useState<{
    x?: number; // offset of the top left point of the box
    y?: number;
    innerDivOffsetX?: number; // left offset within the draggable
    innerDivOffsetY?: number; // top offset within the draggable
    id?: string;
  }>();

  const updateItem = (id: SensorId, newData: Partial<Sensor>) => {
    const sensorToUpdate = sensorContext.mySensors.find((s) => s.id === id);
    sensorToUpdate.offsetX = newData.offsetX ?? sensorToUpdate.offsetX;
    sensorToUpdate.offsetY = newData.offsetY ?? sensorToUpdate.offsetY;
    sensorToUpdate.isPinned = newData.isPinned ?? sensorToUpdate.isPinned;
  };

  // where in the canvas have we clicked - x and y
  const getClickCoordinates = (e: MouseEvent) => ({
    x: (e as any as MouseEvent).pageX - canvasContainerRef.current.offsetLeft,
    y: (e as any as MouseEvent).pageY - canvasContainerRef.current.offsetTop,
  });

  const onUnpinnedDragStop = (e: DraggableEvent, item: Sensor) => {
    if (!dragPosition) {
      return;
    }

    const clickCoordinates = getClickCoordinates(e as any);
    console.log(clickCoordinates);
    const dropPosition = {
      ...clickCoordinates,
      id: item.id,
      innerDivOffsetX: dragPosition.innerDivOffsetX,
      innerDivOffsetY: dragPosition.innerDivOffsetY,
    };

    const {
      scale,
      positionX, // top left x of visible canvas
      positionY,
    } = canvasPositionState();

    let defaultX = (-positionX + dropPosition.x) / scale;
    let defaultY = (-positionY + dropPosition.y) / scale;

    // scale the inner offsets by ration preview/actual item
    defaultX -=
      dropPosition.innerDivOffsetX *
      (dimensionConfig.elemConfig.width / dimensionConfig.previewConfig.width);
    defaultY -=
      dropPosition.innerDivOffsetY *
      (dimensionConfig.elemConfig.height / dimensionConfig.previewConfig.height);

    updateItem(dropPosition.id, {
      offsetX: Math.ceil(defaultX),
      offsetY: Math.ceil(defaultY),
      isPinned: true,
    });

    setDragPosition(null);
    setInsideRightbar(false);
  };

  const onUnpinnedDrag = (e: DraggableEvent, data: DraggableData, item: Sensor) => {
    // this will be called multiple times, so we do it only the first time around
    if (dragPosition) {
      return;
    }

    const parentScrollTop = data.node.parentElement.parentElement.parentElement.scrollTop;
    const parentOffsetLeft = data.node.offsetLeft;
    const parentOffsetTop = data.node.offsetTop - parentScrollTop; // subtract what we've scrolled

    console.log(parentOffsetLeft);
    console.log(parentOffsetTop);
    const innerDivOffsetX =
      (e as any as MouseEvent).pageX -
      window.innerWidth +
      rightbarRef.current.clientWidth -
      parentOffsetLeft;

    const innerDivOffsetY =
      (e as any as MouseEvent).pageY -
      window.innerHeight +
      rightbarRef.current.clientHeight -
      parentOffsetTop;

    setDragPosition({
      x: parentOffsetLeft + 10, // account for padding
      y: parentOffsetTop + 10,
      innerDivOffsetX,
      innerDivOffsetY,
      id: item.id,
    });
  };

  const canvas = {
    scale: 1,
    canvasX: 0,
    canvasY: 0,
  };

  const updateCanvas = () => {
    // TODO
    const update = {
      scale: canvasPositionState().scale,
      canvasX: canvasPositionState().positionX,
      canvasY: canvasPositionState().positionY,
    };
  };

  const [insideRightbar, setInsideRightbar] = useState<boolean>(false);
  const rightbarEnter = () => {
    setInsideRightbar(true);
  };

  const rightbarLeave = () => {
    setInsideRightbar(false);
  };

  return (
    <div className={classes.container}>
      {sensorContext.mySensors.length === 0 && (
        <Box style={{ textAlign: 'center', marginTop: '50px' }}>
          <Typography variant="h4">No sensors found. Try adding some.</Typography>
        </Box>
      )}
      <div className={classes.root} ref={canvasContainerRef}>
        <TransformWrapper
          ref={transformRef}
          initialScale={canvas?.scale}
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
          initialPositionX={canvas?.canvasX}
          initialPositionY={canvas?.canvasY}
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
                      updateItem(s.id, {
                        offsetX: Math.floor(data.x),
                        offsetY: Math.floor(data.y),
                      });
                    }}
                    scale={canvasPositionState().scale}
                    defaultPosition={{
                      x: s.offsetX,
                      y: s.offsetY,
                    }}
                  >
                    <div className={classes.canvasItem}>
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
          pointerEvents: insideRightbar ? 'auto' : 'none',
        }}
      >
        <div
          className={classes.innerRightbar}
          onMouseEnter={rightbarEnter}
          onMouseLeave={rightbarLeave}
        >
          {sidebarSensors().map((s) => (
            <div className={classes.rightbarItem}>
              <Draggable
                key={s.id}
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
          <MenuItem onClick={() => updateItem(s.id, { isPinned: false })}>
            <ColoredButton colorVariety={ColorsEnum.BLUE}>Remove item</ColoredButton>
          </MenuItem>
        </ContextMenu>
      ))}
    </div>
  );
};

export default withStyles(styles)(observer(SensorCanvasPage));
