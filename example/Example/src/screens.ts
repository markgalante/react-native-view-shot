import FullScreen from "./Full";
import ViewshootScreen from "./Viewshoot";
import TransparencyScreen from "./Transparency";
import VideoScreen from "./Video";
import WebViewScreen from "./WebView";
import MapViewScreen from "./MapView";
// import CanvasScreen from "./Canvas";
// import GLReactV2Screen from './GLReactV2';
import SVGUriScreen from "./SVGUri";
import SVGScreen from "./SVG";
import FSScreen from "./FS";
import ModalScreen from "./Modal";
import ImageScreen from "./Image";

const screens = {
  Full: { screen: FullScreen },
  Viewshoot: { screen: ViewshootScreen },
  Transparency: { screen: TransparencyScreen },
  Video: { screen: VideoScreen },
  WebView: { screen: WebViewScreen },
  MapView: { screen: MapViewScreen },
  // Canvas: { screen: CanvasScreen },
  // GLReactV2: { screen: GLReactV2Screen },
  SVGUri: { screen: SVGUriScreen },
  SVG: { screen: SVGScreen },
  FS: { screen: FSScreen },
  Modal: { screen: ModalScreen },
  Image: { screen: ImageScreen },
};

export type Screens = keyof typeof screens;

export default screens;
