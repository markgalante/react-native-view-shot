import * as React from "react";
import { StyleSheet, View, SafeAreaView, Image } from "react-native";
import Btn from "./Btn";
import { captureRef } from "react-native-view-shot";

const styles = StyleSheet.create({
  root: {
    padding: 50,
  },
  preview: {
    marginTop: 20,
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  modal: {
    alignSelf: "flex-end",
    padding: 20,
    backgroundColor: "#eee",
  },
  buttons: {
    flexDirection: "row",
  },
});

const ImageExample = () => {
  const [source, setSource] = React.useState<{ uri: string }>();
  const imageRef = React.useRef<Image>(null);

  const onCapture = React.useCallback((base64: string) => {
    setSource({ uri: "data:image/jpg;base64," + base64 });
  }, []);

  const onPressCapture = React.useCallback(() => {
    captureRef(imageRef, {
      result: "base64",
      format: "jpg",
      quality: 0.8,
      handleGLSurfaceViewOnAndroid: true,
      snapshotContentContainer: false,
      height: 200,
      width: 200,
    }).then(onCapture);
  }, [onCapture]);

  return (
    <React.Fragment>
      <SafeAreaView>
        <View style={styles.root}>
          <Btn onPress={onPressCapture} label="Capture Image" />
          <Image
            ref={imageRef}
            source={require("./cat.jpg")}
            style={styles.preview}
            resizeMode="contain"
          />
          <Image source={source} style={styles.preview} resizeMode="contain" />
        </View>
      </SafeAreaView>
    </React.Fragment>
  );
};

ImageExample.navigationOptions = {
  title: "Image",
};

export default ImageExample;
