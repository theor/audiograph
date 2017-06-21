import * as React from 'react';
import { Component } from 'react';

import * as Debug from 'debug';
var debug = Debug('NexusUICanvas');

// TODO: define this as 'dial' | 'matrix' | 'slider' | ...
export type NxType = string; // 'dial' | 'matrix' ,etc...

export type ColorString = string; // hex color, css style :  '#ffffff'

interface Attributes {
  [index: string]: any;
}

export interface NxWidget extends Attributes {
  // TODO: This is just a partial property definitions. Need to add all properties.
  canvas: any;
  height: number;
  width: number;
  preMove: any;
  preRelease: any;
  canvasID: any;
  colors: {
    accent: ColorString,
    fill: ColorString,
    border: ColorString,
    black: ColorString,
    white: ColorString,
  };
  init(): void;
  draw(): void;
  resize(w?: number, h?: number): void;
  checkPercentage(): void;
  transmit(data: any): void;
  set(value: any): void;
  getName(): string;
}

export interface WidgetAttributes extends Attributes {
  val: any;
  colors?: {
    accent?: ColorString,
    fill?: ColorString,
    border?: ColorString,
    black?: ColorString,
    white?: ColorString,
  };
}

/**
 * This interface can be used when defining specific Nx widget wrappers, 
 * which set the NxType and accept as props this interface.
 */
export interface NexusUICanvasPropsBase {
  /**
   * An object containing properties that are to be set on the created 
   * canvas element before it is transformed into an NX widget.
   */
  canvasAttrs?: Attributes;
  /**
   * A callback when the widget is created, and canvas mounted.
   * 
   * Remember to call widget.init() or widget.draw() if needed inside initWidget().
   **/
  initWidget?: (widget: NxWidget) => void;
}

export interface NexusUICanvasProps extends NexusUICanvasPropsBase {
  type: NxType;
}

// This is optional, but recommanded to set as false.
// to avoid global variable to the window object, which is not needed
// when using React.
(window as any).nx.globalWidgets = false;

export default class NexusUICanvas extends Component<NexusUICanvasProps, {}> {
  mountedCanvas: HTMLCanvasElement;
  widget: NxWidget;

  /**  @method destroy
  Remove the widget object, canvas, and all related event listeners from the document.
  */
  static destroyWidget(widget: NxWidget) {
    const nx = (window as any).nx;
    var type = nx.elemTypeArr.indexOf(widget.getName());
    nx.elemTypeArr.splice(type, 1);

    widget.canvas.ontouchmove = null;
    widget.canvas.ontouchend = null;
    widget.canvas.onclick = null;
    widget.canvas.onmousemove = null;
    widget.canvas.onmouseoff = null;
    document.removeEventListener("mousemove", widget.preMove, false);
    document.removeEventListener("mouseup", widget.preRelease, false);

    // Commented-out original code which is inappropriate for React (EM)
    // var elemToKill = document.getElementById(this.canvasID)
    // if (elemToKill) {
    //   elemToKill.parentNode.removeChild(elemToKill);
    // }

    var id = widget.canvasID;
    delete nx.widgets[id];
    // Added a check for nx.globalWidgets (EM)
    if ((window as any).nx.globalWidgets === true) {
      delete window[id];
    }
  }


  componentDidMount() {
    debug('componentDidMount() canvas.id: ', this.mountedCanvas.id, 'elm=', this.mountedCanvas);
    // We set the canvas attribute 'nx' = type instead of calling transform(type),
    // because manager.blockMove() is looking for the canvas.nx attribute.
    this.mountedCanvas.setAttribute('nx', this.props.type);
    this.setCanvasAttributesFromProps();

    // widget has internal state which is initialized (by the canvas) only when the widget is created.
    // If the canvas is changed, we need to create a new widget.
    // For example widget.height is initialized from canvas style when creating a new Widget. But it 
    // doesn't update when canvas style is changed.
    this.widget = (window as any).nx.transform(this.mountedCanvas);

    if (this.props.initWidget) {
      this.props.initWidget(this.widget);
    }
  }

  componentWillUnmount() {
    debug('componentWillUnmount() destroy canvas.id= ', this.mountedCanvas.id);

    // We don't call the original widget.destroy() because it 
    // removes the canvas from the DOM, and we should leave that to React.
    NexusUICanvas.destroyWidget(this.widget);
  }

  componentWillUpdate() {
    debug('componentWillUpdate()');
  }

  shouldComponentUpdate(nextProps: NexusUICanvasProps, nextState: {}) {
    // TODO: maybe optimize in case only props.canvasAttrs changes ...
    return true;
  }

  componentDidUpdate() {
    debug('componentDidUpdate() widget=', this.widget);

    // This is a partial solution , it is not perfect, and problematic.
    // It would work best if we could somehow reset the state of the canvas and the widget,
    // and only then run these update functions.

    // Update Canvas
    this.setCanvasAttributesFromProps();
    this.resizeIfNeeded();

    // Init Widget
    if (this.props.initWidget) {
      this.props.initWidget(this.widget);
    }

  }

  render() {
    debug('render(): props=', this.props);
    return (
      <canvas ref={(x) => { if (x) { this.refCallback(x); } }}/>
    );
  }

  refCallback(domElement: HTMLCanvasElement) {
    debug('refCallback() domElm=', domElement);
    this.mountedCanvas = domElement;
  }

  setCanvasAttributesFromProps() {
    const attrs = this.props.canvasAttrs;
    if (attrs) {
      Object.keys(attrs).forEach((attrName) => {
        this.mountedCanvas.setAttribute(attrName, attrs[attrName]);
      });
    }
  }

  /**
   * Called when componentDidUpdate() was called.
   * Checks if needs to resize the widget according to canvas props.
   * 
   * canvas.style width&height take precedence over canvas widht&height, incase both appear on the
   * this.props.canvasAttrs
   */
  resizeIfNeeded() {
    if(!this.props.canvasAttrs)
        return;
    const attrs: Attributes = this.props.canvasAttrs;
    if (attrs.style) {
      if (attrs.style.width && attrs.style.height) {
        this.widget.resize(attrs.style.width, attrs.style.height);
      }
    } else if (attrs.width && attrs.height) {
      this.widget.resize(attrs.width, attrs.height);
    }
  }
}