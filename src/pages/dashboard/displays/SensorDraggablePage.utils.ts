import { fabric } from 'fabric';
import { useCallback, useRef } from 'react';
import ColorsEnum from 'types/ColorsEnum';
import Sensor from 'types/Sensor';

export interface Metadata {
  sensorId?: Sensor['id'];
}

export const useFabric = (
  onChange: (ref: fabric.Canvas) => fabric.Canvas,
  options: fabric.ICanvasOptions,
  onRightClick: (coordinates: { x: number; y: number }, target: any) => void,
  reaction: any[],
) => {
  const fabricRef = useRef<fabric.Canvas>();
  const disposeRef = useRef<fabric.Canvas>();

  return useCallback((node: HTMLCanvasElement) => {
    if (node) {
      const fabricCanvas = new fabric.Canvas(node, {
        ...options,
        imageSmoothingEnabled: false,
        fireRightClick: true, // <-- enable firing of right click events
        fireMiddleClick: true, // <-- enable firing of middle click events
        stopContextMenu: true, // <--  prevent context menu from showing
      });
      fabricRef.current = fabricCanvas;

      const gridSize = 5;

      const Snap = (value) => {
        return Math.round(value / gridSize) * gridSize;
      };

      fabricCanvas.on('object:scaling', (event) => {
        const { transform } = event;
        // @ts-ignore
        const { target } = transform;

        const targetWidth = target.width * target.scaleX;
        const targetHeight = target.height * target.scaleY;

        const snap = {
          // closest width to snap to
          width: Snap(targetWidth),
          height: Snap(targetHeight),
        };

        const threshold = gridSize;

        const dist = {
          // distance from current width to snappable width
          width: Math.abs(targetWidth - snap.width),
          height: Math.abs(targetHeight - snap.height),
        };

        const centerPoint = target.getCenterPoint();

        const anchorY = transform.originY;
        const anchorX = transform.originX;

        const anchorPoint = target.translateToOriginPoint(centerPoint, anchorX, anchorY);

        const attrs = {
          scaleX: target.scaleX,
          scaleY: target.scaleY,
        };

        switch (transform.corner) {
          case 'tl':
          case 'br':
          case 'tr':
          case 'bl':
            if (dist.width < threshold) {
              attrs.scaleX = snap.width / target.width;
            }

            if (dist.height < threshold) {
              attrs.scaleY = snap.height / target.height;
            }

            break;
          case 'mt':
          case 'mb':
            if (dist.height < threshold) {
              attrs.scaleY = snap.height / target.height;
            }

            break;
          case 'ml':
          case 'mr':
            if (dist.width < threshold) {
              attrs.scaleX = snap.width / target.width;
            }

            break;
          default:
            break;
        }

        if (attrs.scaleX !== target.scaleX || attrs.scaleY !== target.scaleY) {
          target.set(attrs);
          target.setPositionByOrigin(anchorPoint, anchorX, anchorY);
        }
      });

      fabricCanvas.on('mouse:down', function (event) {
        const evt = event.e;

        // clicking on an object
        if (event.target !== null) {
          event.e.stopPropagation();
          event.e.stopImmediatePropagation();
          event.e.preventDefault();

          // right click
          if (event.button === 3 && event.target.type === 'group') {
            const pointer = this.getPointer(event as any);

            setTimeout(() => {
              onRightClick(pointer, event.target);
            }, 0);
          }
        } else {
          // not clicking on an object inside camvas
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      });

      fabricCanvas.on('object:moving', (options) => {
        options.target.set({
          left: Snap(options.target.left),
          top: Snap(options.target.top),
        });
      });

      fabricCanvas.on('mouse:wheel', function (opt) {
        const { deltaY: delta, offsetX, offsetY } = opt.e;
        let zoom = fabricCanvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 1) zoom = 1;

        const point = {
          x: offsetX,
          y: offsetY,
        };
        fabricCanvas.zoomToPoint(point, zoom);

        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      fabricCanvas.on('mouse:move', function (opt) {
        if (this.isDragging) {
          const { e } = opt;
          const vpt = this.viewportTransform;
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });
      fabricCanvas.on('mouse:up', function (opt) {
        // on mouse up we want to recalculate new interaction
        // for all objects, so we call setViewportTransform
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
      });

      document.onkeydown = function (e) {
        const activeObjects = fabricCanvas.getActiveObjects();
        if (activeObjects.length > 0) {
          switch (e.keyCode) {
            case 46: // delete
              fabricCanvas.remove(...activeObjects);
              break;
            default:
              break;
          }
          fabricCanvas.renderAll();
        }
      };

      if (onChange) {
        disposeRef.current = onChange(fabricRef.current);
      }
    } else if (fabricRef.current) {
      fabricRef.current.dispose();
      if (disposeRef.current) {
        try {
          disposeRef.current.dispose();
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, reaction);
};

export const addWall = (canvas: fabric.Canvas, x: number, y: number) => {
  const wallConfig: fabric.IRectOptions = {
    top: y,
    left: x,
    width: 9,
    height: 69,
    fill: 'white',
    lockScalingX: true,
    snapAngle: 10,
  };
  const wallControlVisibility = {
    bl: false,
    br: false,
    tl: false,
    tr: false,
    mb: true,
    ml: false,
    mr: false,
    mt: true,
    mtr: true,
  };
  const rect = new fabric.Rect(wallConfig);
  rect.setControlsVisibility(wallControlVisibility);
  canvas.add(rect);
};

export const addText = (canvas: fabric.Canvas, x: number, y: number) => {
  const itext = new fabric.IText('This is a IText object', {
    top: y,
    left: x,
    fill: ColorsEnum.PINK,
    hasControls: false,
    fontSize: 16,
  });
  canvas.add(itext);
};

export const addTemperature = (canvas: fabric.Canvas, x: number, y: number) => {
  const rect = new fabric.Rect({
    width: 50,
    height: 30,
    stroke: ColorsEnum.RED,
    strokeWidth: 1,
    fill: ColorsEnum.BGLIGHT,
  });
  const itext = new fabric.IText('32°C', {
    left: 5,
    top: 5,
    fill: ColorsEnum.WHITE,
    fontSize: 16,
    editable: true,
  });
  const group1 = new fabric.Group([rect, itext], { left: x, top: y, hasControls: false });
  canvas.add(group1);
};

export const addHumidity = (canvas: fabric.Canvas, x: number, y: number) => {
  const rect = new fabric.Rect({
    width: 50,
    height: 30,
    stroke: ColorsEnum.BLUE,
    strokeWidth: 1,
    fill: ColorsEnum.BGLIGHT,
  });
  const itext = new fabric.IText('40%', {
    left: 5,
    top: 5,
    fill: ColorsEnum.WHITE,
    fontSize: 16,
  });
  const group1 = new fabric.Group([rect, itext], { left: x, top: y, hasControls: false });
  canvas.add(group1);
};

export const addBorderRect = (
  canvas: fabric.Canvas,
  width: number,
  height: number,
  innerWidth: number,
  innerHeight: number,
) => {
  const borderRect = new fabric.Rect({
    left: width / 2 - innerWidth / 2,
    top: height / 2 - innerHeight / 2,
    width: innerWidth,
    height: innerHeight,
    hasControls: false,
    selectable: false,
    hoverCursor: 'default',
    stroke: ColorsEnum.BGLIGHTER,
    strokeWidth: 7,
    fill: ColorsEnum.BGLIGHT,
  });
  canvas.add(borderRect);
};

export const additionalPropertiesToSave = [
  'selectable',
  'hoverCursor',
  'hasControls',
  'lockScalingX',
  'lockRotation',
  '_controlsVisibility',
  'snapAngle',
  'editable',
  'sensorId',
  // 'on',
];
