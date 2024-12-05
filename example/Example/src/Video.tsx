//@flow
import React, { useState, useCallback } from "react";
import { SafeAreaView, Image } from "react-native";
import ViewShot from "react-native-view-shot";
import Video from "react-native-video";
import Desc from "./Desc";

const sample = require("./broadchurch.mp4");

const VideoExample = () => {
  const [source, setSource] = useState<{ uri: string } | null>(null);
  const onCapture = useCallback((uri: string) => setSource({ uri }), []);
  return (
    <SafeAreaView>
      <ViewShot
        options={{
          handleGLSurfaceViewOnAndroid: true,
          format: "jpg",
          quality: 0.9,
          result: "base64",
          width: 180,
          height: 90,
          snapshotContentContainer: false,
        }}
        onCapture={onCapture}
        captureMode="continuous"
      >
        <Video
          disableFocus // NOTE: https://github.com/react-native-video/react-native-video/issues/2666
          style={{ width: 180, height: 90 }}
          source={sample}
          volume={0}
          repeat
          resizeMode="cover"
        />
        <Video
          disableFocus // NOTE: https://github.com/react-native-video/react-native-video/issues/2666
          style={{ width: 180, height: 90 }}
          source={sample}
          volume={0}
          repeat
          resizeMode="cover"
          useTextureView={false} // Use SurfaceView
        />
      </ViewShot>

      <Desc desc="above is a video and below is a continuous screenshot of it" />

      <Image
        fadeDuration={0}
        source={{ uri: source?.uri }}
        style={{ width: "100%", height: 196 }}
      />
    </SafeAreaView>
  );
};

VideoExample.navigationOptions = {
  title: "react-native-video",
};

export default VideoExample;
