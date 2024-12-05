import * as React from "react";
import { SafeAreaView, Image } from "react-native";
import ViewShot from "react-native-view-shot";
import WebView from "react-native-webview";
import Desc from "./Desc";

const dimension = { width: 300, height: 300 };

const WebViewExample = () => {
  const [source, setSource] = React.useState<{ uri: string } | null>(null);
  const onCapture = React.useCallback((uri: string) => setSource({ uri }), []);
  return (
    <SafeAreaView>
      <ViewShot
        onCapture={onCapture}
        captureMode="continuous"
        style={dimension}
      >
        <WebView
          source={{
            uri: "https://github.com/gre/react-native-view-shot",
          }}
        />
      </ViewShot>

      <Desc desc="above is a webview and below is a continuous screenshot of it" />

      <Image fadeDuration={0} source={{ uri: source?.uri }} style={dimension} />
    </SafeAreaView>
  );
};

WebViewExample.navigationOptions = {
  title: "react-native-webview",
};

export default WebViewExample;
