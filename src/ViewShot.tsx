import * as React from "react";
import {
  View,
  findNodeHandle,
  type LayoutChangeEvent,
  LayoutRectangle,
} from "react-native";

import type { Options, ViewShotProps } from "./types";
import RNViewShot from "./RNViewShot";
import { validateOptions, checkCompatibleProps } from "./View.Shot.utils";

const neverEndingPromise = new Promise(() => {});

if (!RNViewShot) {
  console.warn(
    "react-native-view-shot: RNViewShot is undefined. Make sure the library is linked on the native side."
  );
}

function ensureRNViewShotIsLoaded() {
  if (!RNViewShot) {
    throw new Error(
      "react-native-view-shot: NativeModules.RNViewShot is undefined. Make sure the library is linked on the native side."
    );
  }
}

/**
 * Captures a screenshot of a given view reference.
 *
 * @template T - The type of the view reference.
 * @param {number | View | React.RefObject<T>} view - The view to capture. It can be a view ID, a View instance, or a React ref object.
 * @param {Options} [optionsObject] - Optional configuration for the capture.
 * @returns {Promise<string>} A promise that resolves to the file path of the captured screenshot.
 * @throws {Error} If the view reference is invalid or if the capture fails.
 */
export function captureRef<T = React.ElementType>(
  view: number | View | React.RefObject<T>,
  optionsObject?: Options
): Promise<string> {
  ensureRNViewShotIsLoaded();
  if (typeof view === "object" && "current" in view && view.current) {
    if (!view) {
      return Promise.reject(new Error("ref.current is null"));
    }
  }
  let resolvedView = (view as React.RefObject<T>).current;
  if (typeof resolvedView !== "number") {
    const node = findNodeHandle(
      resolvedView as unknown as
        | React.Component<any, any, any>
        | React.ComponentClass<any, any>
    );
    if (!node) {
      return Promise.reject(
        new Error("findNodeHandle failed to resolve view=" + String(view))
      );
    }
    resolvedView = node as unknown as T;
  }
  const { options, errors } = validateOptions(optionsObject);
  if (__DEV__ && errors.length > 0) {
    console.warn(
      "react-native-view-shot: bad options:\n" +
        errors.map((e) => `- ${e}`).join("\n")
    );
  }
  return RNViewShot.captureRef(resolvedView as number, options);
}

export function releaseCapture(uri: string): void {
  if (typeof uri !== "string") {
    if (__DEV__) {
      console.warn("Invalid argument to releaseCapture. Got: " + uri);
    }
  } else {
    RNViewShot.releaseCapture(uri);
  }
}

export function captureScreen(optionsObject?: Options): Promise<string> {
  ensureRNViewShotIsLoaded();
  const { options, errors } = validateOptions(optionsObject);
  if (__DEV__ && errors.length > 0) {
    console.warn(
      "react-native-view-shot: bad options:\n" +
        errors.map((e) => `- ${e}`).join("\n")
    );
  }
  return RNViewShot.captureScreen(options);
}

export const ViewShot = React.forwardRef(function ViewShot(
  {
    options,
    captureMode,
    children,
    onLayout,
    onCapture,
    onCaptureFailure,
    ...props
  }: ViewShotProps,
  forwardedRef: React.Ref<View> = null
) {
  const root = React.useRef<View>(null);
  React.useImperativeHandle(forwardedRef, () => root.current || ({} as View));
  const [firstLayout, setFirstLayout] = React.useState<LayoutRectangle>();
  const [lastCapturedURI, setLastCapturedURI] = React.useState<string>();
  const viewShotRef = React.useRef<number | null>(
    null
  ) as React.MutableRefObject<number | null>;

  const capture = React.useCallback((): Promise<string | unknown> => {
    if (!firstLayout) return neverEndingPromise;
    if (!root.current) return neverEndingPromise;
    return captureRef(root.current, options).then(
      (uri: string) => {
        handleCapture(uri);
        return uri;
      },
      (e: Error) => {
        handleCaptureFailure(e);
        throw e;
      }
    );
  }, [firstLayout, options]);

  const handleCapture = React.useCallback(
    (uri: string) => {
      if (!root.current) {
        return;
      }
      if (lastCapturedURI) {
        setTimeout(releaseCapture, 500, lastCapturedURI);
      }
      setLastCapturedURI(uri);
      onCapture?.(uri);
    },
    [lastCapturedURI, onCapture]
  );

  const handleCaptureFailure = React.useCallback(
    (e: Error) => {
      if (!root.current) {
        return;
      }
      onCaptureFailure?.(e);
    },
    [onCaptureFailure]
  );

  const syncCaptureLoop = React.useCallback(
    (captureMode: ViewShotProps["captureMode"]) => {
      if (viewShotRef.current) {
        cancelAnimationFrame(viewShotRef.current);
      }
      if (captureMode === "continuous") {
        let previousCaptureURI = "-";
        const loop = () => {
          viewShotRef.current = requestAnimationFrame(loop);
          if (previousCaptureURI === lastCapturedURI) return;
          if (lastCapturedURI) {
            previousCaptureURI = lastCapturedURI;
          }
          capture();
        };
        viewShotRef.current = requestAnimationFrame(loop);
      }
    },
    [capture, lastCapturedURI]
  );

  const handleLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      setFirstLayout(e.nativeEvent.layout);
      if (onLayout) onLayout(e);
    },
    [onLayout]
  );

  React.useEffect(() => {
    if (__DEV__)
      checkCompatibleProps({
        options,
        captureMode,
        children,
        onLayout,
        onCapture,
        onCaptureFailure,
        ...props,
      });
    if (captureMode === "mount") {
      capture();
    } else {
      syncCaptureLoop(captureMode);
    }
    return () => syncCaptureLoop(captureMode);
  }, [captureMode, capture, syncCaptureLoop]);

  React.useEffect(() => {
    if (captureMode === "update") {
      capture();
    }
  }, [captureMode, capture]);

  return (
    <View ref={root} collapsable={false} onLayout={handleLayout} {...props}>
      {children}
    </View>
  );
});
