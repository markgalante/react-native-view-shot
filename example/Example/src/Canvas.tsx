import * as React from "react";
import { SafeAreaView, Image, View } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import Canvas from "react-native-canvas";

const dimension = { width: 300, height: 300 };

const CanvasRendering = ({ onDrawn }: { onDrawn: () => void }) => {
  const ref = React.useRef<Canvas>(null);
  React.useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#eee";
      if (ref.current && ref.current.width && ref.current.height) {
        ctx.fillRect(0, 0, ref.current.width, ref.current.height);
      }
      ctx.fillStyle = "red";
      ctx.fillRect(120, 30, 60, 60);
      ctx.fillStyle = "blue";
      ctx.fillRect(140, 50, 60, 60);
    }

    const timeout = setTimeout(onDrawn, 1000); // hack. react-native-canvas have no way to tell when it's executed
    return () => clearTimeout(timeout);
  }, [onDrawn]);
  return <Canvas ref={ref} style={dimension} />;
};

const CanvasExample = () => {
  const [source, setSource] = React.useState<{ uri: string } | null>(null);
  const viewShotRef = React.useRef<View>(null);
  const onCapture = React.useCallback(() => {
    if (viewShotRef.current) {
      captureRef(viewShotRef.current).then((uri: string) => setSource({ uri }));
    }
  }, []);
  return (
    <SafeAreaView>
      <ViewShot ref={viewShotRef} style={dimension}>
        <CanvasRendering onDrawn={onCapture} />
      </ViewShot>

      <Image fadeDuration={0} source={{ uri: source?.uri }} style={dimension} />
    </SafeAreaView>
  );
};

CanvasExample.navigationOptions = {
  title: "react-native-canvas",
};

export default CanvasExample;
