import { Platform } from "react-native";

import type { Options, ViewShotProps } from "./types";

const acceptedFormats = ["png", "jpg"].concat(
  Platform.OS === "android" ? ["webm", "raw"] : []
);

const acceptedResults = ["tmpfile", "base64", "data-uri"].concat(
  Platform.OS === "android" ? ["zip-base64"] : []
);

const defaultOptions: Options = {
  format: "png",
  quality: 1,
  result: "tmpfile",
  snapshotContentContainer: false,
  handleGLSurfaceViewOnAndroid: false,
};

// validate and coerce options
export function validateOptions(input?: Partial<Options>): {
  options: Options;
  errors: Array<string>;
} {
  const {
    width,
    height,
    quality,
    snapshotContentContainer,
    handleGLSurfaceViewOnAndroid,
    format,
    result,
    ...rest
  } = {
    ...defaultOptions,
    ...input,
  };
  const options: Options = {
    width,
    height,
    quality,
    snapshotContentContainer,
    handleGLSurfaceViewOnAndroid,
    format,
    result,
    ...rest,
  };
  const errors = [];
  if (typeof width !== "number" || width <= 0) {
    errors.push("option width should be a positive number");
    delete options.width;
  }
  if (typeof height !== "number" || height <= 0) {
    errors.push("option height should be a positive number");
    delete options.height;
  }
  if (typeof quality !== "number" || quality < 0 || quality > 1) {
    errors.push("option quality should be a number between 0.0 and 1.0");
    options.quality = defaultOptions.quality;
  }
  if (typeof snapshotContentContainer !== "boolean") {
    errors.push("option snapshotContentContainer should be a boolean");
  }
  if (typeof handleGLSurfaceViewOnAndroid !== "boolean") {
    errors.push("option handleGLSurfaceViewOnAndroid should be a boolean");
  }
  if (acceptedFormats.indexOf(format) === -1) {
    options.format = defaultOptions.format;
    errors.push(
      "option format '" +
        options.format +
        "' is not in valid formats: " +
        acceptedFormats.join(" | ")
    );
  }
  if (acceptedResults.indexOf(result) === -1) {
    options.result = defaultOptions.result;
    errors.push(
      "option result '" +
        options.result +
        "' is not in valid formats: " +
        acceptedResults.join(" | ")
    );
  }
  return { options, errors };
}

/**
 * Checks the compatibility of the provided props for the `ViewShot` component.
 *
 * @param {Object} props - The properties to check.
 * @param {string} [props.captureMode] - The mode of capture. Can be "continuous" or "update".
 * @param {Function} [props.onCapture] - The callback function to be called on capture.
 * @param {Object} [props.options] - Additional options for capturing.
 * @param {string} [props.options.result] - The result format of the capture. Recommended to be "tmpfile" for continuous or update capture modes.
 *
 * @remarks
 * - If `captureMode` is defined but `onCapture` is missing, a warning will be logged.
 * - If `captureMode` is "continuous" or "update" and `options.result` is not "tmpfile", a warning will be logged recommending "tmpfile".
 */
export function checkCompatibleProps({
  captureMode,
  onCapture,
  options,
}: ViewShotProps) {
  if (!captureMode && onCapture) {
    // in that case, it's authorized if you call capture() yourself
  } else if (captureMode && !onCapture) {
    console.warn(
      "react-native-view-shot: captureMode prop is defined but onCapture prop callback is missing"
    );
  } else if (
    (captureMode === "continuous" || captureMode === "update") &&
    options &&
    options.result &&
    options.result !== "tmpfile"
  ) {
    console.warn(
      "react-native-view-shot: result=tmpfile is recommended for captureMode=" +
        captureMode
    );
  }
}
