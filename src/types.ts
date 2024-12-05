import type { LayoutChangeEvent, ViewProps } from "react-native";

export type Options = {
  width?: number;
  height?: number;
  format: "png" | "jpg" | "webm" | "raw";
  quality: number;
  result: "tmpfile" | "base64" | "data-uri" | "zip-base64";
  snapshotContentContainer: boolean;
  handleGLSurfaceViewOnAndroid: boolean;
};

export type ViewShotProps = ViewProps & {
  options?: Options;
  captureMode?: "mount" | "continuous" | "update";
  children: React.ReactNode;
  onLayout?: (e: LayoutChangeEvent) => void;
  onCapture?: (uri: string) => void;
  onCaptureFailure?: (e: Error) => void;
};
