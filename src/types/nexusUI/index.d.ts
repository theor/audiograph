type WidgetType = string;

interface Attributes {
  [index: string]: any;
}


// TODO: define this as 'dial' | 'matrix' | 'slider' | ...
declare type NxType = string; // 'dial' | 'matrix' ,etc...

declare type ColorString = string; // hex color, css style :  '#ffffff'

declare interface NxWidget extends Attributes {
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
  on(event:string, cb: (this:NxWidget, data:any) => void): void;
}

interface CreationSettings {
    /*Extra settings for the new widget. This settings object may have any of the following properties: x (integer in px), y, w (width), h (height), name (widget’s OSC name and canvas ID), parent (the ID of the element you wish to add the canvas into). If no settings are provided, the element will be at default size and appended to the body of the HTML document.*/
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    name?:string;
    parent?: string;
}

interface Nx {
    add(t:WidgetType,settings?:CreationSettings): void;
    sendsTo(cb:(this:{}, data:any) => void): void;
    skin(theme:string):void;
}

declare const nx: Nx;
