import * as React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  TextInput,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
} from "react-native";
import _ from "lodash";
import { Picker } from "@react-native-picker/picker";
import { Buffer } from "buffer";
import Slider from "@react-native-community/slider";
import { captureRef, captureScreen } from "react-native-view-shot";
import MapView from "react-native-maps";
import WebView from "react-native-webview";
import Video from "react-native-video";
import { SvgUri } from "react-native-svg";

import Btn from "./Btn";

const catsSource = {
  uri: "https://i.imgur.com/5EOyTDQ.jpg",
};

const App = () => {
  const fullRef = React.useRef();
  const headerRef = React.useRef();
  const formRef = React.useRef();
  const emptyRef = React.useRef();
  const complexRef = React.useRef();
  const svgRef = React.useRef();
  const mapViewRef = React.useRef();
  const webviewRef = React.useRef();
  const videoRef = React.useRef();
  const videoSurfaceRef = React.useRef();
  const transformParentRef = React.useRef();
  const transformRef = React.useRef();
  const surfaceRef = React.useRef();

  const [previewSource, setPreviewSource] = React.useState<{
    uri: string;
  } | null>(catsSource);

  const [result, setResult] = React.useState<{ error: any; res: any }>({
    error: null,
    res: null,
  });

  const [config, setConfig] = React.useState<{
    format: string;
    quality: number;
    result: string;
    snapshotContentContainer: boolean;
    width?: number;
    height?: number;
  }>({
    format: "png",
    quality: 0.9,
    result: "file",
    snapshotContentContainer: false,
  });

  const onCapture = React.useCallback(
    (res: any) => {
      if (config.result === "base64") {
        const b = Buffer.from(res, "base64");
        console.log("buffer of length " + b.length);
      }
      setPreviewSource({
        uri:
          config.result === "base64"
            ? "data:image/" + config.format + ";base64," + res
            : res,
      });
      setResult({
        error: null,
        res,
      });
    },
    [config]
  );

  const onCaptureFailure = React.useCallback((error: any) => {
    console.warn(error);
    setPreviewSource(null);
    setResult({
      error,
      res: null,
    });
  }, []);

  const capture = React.useCallback(
    (ref?: any, options = {}) => {
      const opts = { ...config, ...options } as any;
      console.log({ opts });
      (ref ? captureRef(ref, opts) : captureScreen(opts))
        .then(res =>
          config.result !== "file"
            ? res
            : new Promise((success, failure) =>
                // just a test to ensure res can be used in Image.getSize
                Image.getSize(res, (width, height) => success(res), failure)
              )
        )
        .then(onCapture, onCaptureFailure);
    },
    [config, onCapture, onCaptureFailure]
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.root}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          ref={fullRef as any}
          contentContainerStyle={styles.container}
        >
          <View ref={headerRef as any} style={styles.header}>
            <Text style={styles.title}>😃 ViewShot Example 😜</Text>
            <View style={styles.p1}>
              <Text style={styles.text}>This is a </Text>
              <Text style={styles.code}>react-native-view-shot</Text>
              <Text style={styles.text}> showcase.</Text>
            </View>
            <View style={styles.preview}>
              {result.error ? (
                <Text style={styles.previewError}>
                  {"" + (result.error?.message || result.error)}
                </Text>
              ) : (
                <Image
                  fadeDuration={0}
                  resizeMode="contain"
                  style={styles.previewImage}
                  source={{ uri: previewSource?.uri }}
                />
              )}
            </View>
            <Text numberOfLines={1} style={styles.previewUriText}>
              {result.res ? result.res.slice(0, 200) : ""}
            </Text>
          </View>

          <View ref={formRef as any} style={styles.form}>
            <View style={styles.btns}>
              <Btn
                label="😻 Reset"
                onPress={() => setPreviewSource(catsSource)}
              />
              <Btn label="📷 Head Section" onPress={() => capture(headerRef)} />
              <Btn label="📷 Form" onPress={() => capture(formRef)} />
              <Btn
                label="📷 Experimental Section"
                onPress={() => capture(complexRef)}
              />
              <Btn
                label="📷 All (ScrollView)"
                onPress={() => capture(fullRef)}
              />
              <Btn label="📷 SVG" onPress={() => capture(svgRef)} />
              <Btn
                label="📷 Transform"
                onPress={() => capture(transformParentRef)}
              />
              <Btn
                label="📷 Transform Child"
                onPress={() => capture(transformRef)}
              />
              <Btn label="📷 MapView" onPress={() => capture(mapViewRef)} />
              <Btn label="📷 WebView" onPress={() => capture(webviewRef)} />
              <Btn label="📷 Video" onPress={() => capture(videoRef)} />
              <Btn
                label="📷 Video with SurfaceView (Android)"
                onPress={() =>
                  capture(videoRef, { handleGLSurfaceViewOnAndroid: true })
                }
              />
              <Btn label="📷 Native Screenshot" onPress={() => capture()} />
              <Btn
                label="📷 Empty View (should crash)"
                onPress={() => capture(emptyRef)}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Format</Text>
              <Picker
                style={styles.input}
                selectedValue={config.format}
                onValueChange={format => setConfig({ ...config, format })}
              >
                <Picker.Item label="PNG" value="png" />
                <Picker.Item label="JPEG" value="jpg" />
                <Picker.Item label="WEBM (android only)" value="webm" />
                <Picker.Item label="RAW (android only)" value="raw" />
                <Picker.Item label="INVALID" value="_invalid_" />
              </Picker>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Quality</Text>
              <Slider
                style={styles.input}
                value={config.quality}
                onValueChange={quality => setConfig({ ...config, quality })}
              />
              <Text>{(config.quality * 100).toFixed(0)}%</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Size</Text>
              <Switch
                style={styles.switch}
                value={config.width !== undefined}
                onValueChange={checked =>
                  setConfig(
                    _.omit(
                      {
                        ...config,
                        width: 300,
                        height: 300,
                      },
                      checked ? [] : ["width", "height"]
                    )
                  )
                }
              />
              {config.width !== undefined ? (
                <TextInput
                  style={styles.inputText}
                  value={"" + config.width}
                  keyboardType="number-pad"
                  onChangeText={(txt: string) =>
                    !isNaN(Number(txt)) &&
                    setConfig({ ...config, width: parseInt(txt, 10) })
                  }
                />
              ) : (
                <Text style={styles.inputText}>(auto)</Text>
              )}
              <Text>x</Text>
              {config.height !== undefined ? (
                <TextInput
                  style={styles.inputText}
                  value={"" + config.height}
                  keyboardType="number-pad"
                  onChangeText={txt =>
                    !isNaN(Number(txt)) &&
                    setConfig({ ...config, height: parseInt(txt, 10) })
                  }
                />
              ) : (
                <Text style={styles.inputText}>(auto)</Text>
              )}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Result</Text>
              <Picker
                style={styles.input}
                selectedValue={config.result}
                onValueChange={r => setConfig({ ...config, result: r })}
              >
                <Picker.Item label="file" value="file" />
                <Picker.Item label="base64" value="base64" />
                <Picker.Item
                  label="zip-base64 (Android Only)"
                  value="zip-base64"
                />
                <Picker.Item label="data URI" value="data-uri" />
                <Picker.Item label="INVALID" value="_invalid_" />
              </Picker>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>snapshotContentContainer</Text>
              <Switch
                style={styles.switch}
                value={config.snapshotContentContainer}
                onValueChange={snapshotContentContainer =>
                  setConfig({ ...config, snapshotContentContainer })
                }
              />
            </View>
          </View>
          <View ref={emptyRef as any} collapsable={false} />
          <View
            style={styles.experimental}
            ref={complexRef as any}
            collapsable={false}
          >
            <Text style={styles.experimentalTitle}>Experimental Stuff</Text>
            <View ref={svgRef as any} collapsable={false}>
              <SvgUri
                width={200}
                height={200}
                uri="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/heliocentric.svg"
              />
            </View>
            <MapView
              ref={mapViewRef as any}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              style={{ width: 300, height: 300 }}
            />
            <View
              ref={webviewRef as any}
              collapsable={false}
              style={{ width: 300, height: 300 }}
            >
              <WebView
                source={{
                  uri: "https://github.com/gre/react-native-view-shot",
                }}
              />
            </View>
            <Video
              ref={videoRef as any}
              disableFocus // NOTE: https://github.com/react-native-video/react-native-video/issues/2666
              style={{ width: 300, height: 300 }}
              source={require("./broadchurch.mp4")}
              volume={0}
              repeat
            />
            <Video
              ref={videoSurfaceRef as any}
              disableFocus // NOTE: https://github.com/react-native-video/react-native-video/issues/2666
              style={{ width: 300, height: 300 }}
              source={require("./broadchurch.mp4")}
              volume={0}
              repeat
              useTextureView={false} // Use SurfaceView
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#f6f6f6",
  },
  container: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  experimental: {
    padding: 10,
    flexDirection: "column",
    alignItems: "center",
  },
  experimentalTitle: {
    fontSize: 16,
    margin: 10,
  },
  experimentalTransform: {
    transform: [{ rotate: "180deg" }],
    backgroundColor: "powderblue",
  },
  experimentalTransformV2: {
    //    transform: [{ rotate: '180deg' }],
    backgroundColor: "skyblue",
  },
  p1: {
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#333",
  },
  code: {
    fontWeight: "bold",
    color: "#000",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  label: {
    minWidth: 80,
    fontStyle: "italic",
    color: "#888",
  },
  switch: {
    marginRight: 50,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputText: {
    flex: 1,
    marginHorizontal: 5,
    color: "red",
    textAlign: "center",
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  previewImage: {
    width: 375,
    height: 300,
  },
  previewUriText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    padding: 10,
    paddingBottom: 0,
  },
  previewError: {
    width: 375,
    height: 300,
    paddingTop: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#c00",
  },
  header: {
    backgroundColor: "#f6f6f6",
    borderColor: "#000",
    borderWidth: 1,
    paddingBottom: 20,
  },
  form: {
    backgroundColor: "#fff",
  },
  btns: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    margin: 4,
  },
  experimentalRoot: {
    flex: 1,
    flexDirection: "row",
  },
});

App.navigationOptions = {
  title: "Full Example",
};

export default App;
