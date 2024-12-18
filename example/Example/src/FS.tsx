import * as React from "react";
import { SafeAreaView, Image, View } from "react-native";
import ViewShot from "react-native-view-shot";
import RNFS from "react-native-fs";
import Desc from "./Desc";

const dimension = { width: 50, height: 50 };

const FSExample = () => {
  const [source, setSource] = React.useState<{ uri: string }>();
  const onCapture = React.useCallback(async (file: any) => {
    const data = await RNFS.readFile(file, "base64");
    setSource({ uri: "data:image/png;base64," + data });
  }, []);
  return (
    <SafeAreaView>
      <ViewShot onCapture={onCapture} captureMode="mount" style={dimension}>
        <View
          style={{
            ...dimension,
            backgroundColor: "red",
          }}
        />
      </ViewShot>

      <Desc desc="FS to get the image from captured file" />

      <Image fadeDuration={0} source={source} style={dimension} />
    </SafeAreaView>
  );
};

FSExample.navigationOptions = {
  title: "react-native-fs",
};

export default FSExample;
