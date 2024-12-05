import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import Btn from "./Btn";

const Viewshoot = () => {
  const full = React.useRef<View>(null);
  const [preview, setPreview] = React.useState<{ uri: string } | null>(null);
  const [itemsCount, setItemsCount] = React.useState(10);
  const [refreshing, setRefreshing] = React.useState(false);

  const onCapture = React.useCallback(() => {
    if (full.current) {
      captureRef(full.current).then((uri: string) => setPreview({ uri }));
    }
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.root}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => {
              setItemsCount(itemsCount + 10);
              setRefreshing(false);
            }, 5000);
          }}
        />
      }
    >
      <SafeAreaView>
        <ViewShot ref={full} style={styles.container}>
          <Btn onPress={onCapture} label="Shoot Me" />

          <Image
            fadeDuration={0}
            resizeMode="contain"
            style={styles.previewImage}
            source={{ uri: preview?.uri }}
          />

          {Array(itemsCount)
            .fill(null)
            .map((_, index) => ({
              key: index,
              text: `${index + 1}`,
              color: `hsl(${(index * 13) % 360}, 50%, 80%)`,
            }))
            .map(({ key, text, color }) => {
              return (
                <View
                  style={[styles.item, { backgroundColor: color }]}
                  key={key}
                >
                  <Text style={styles.itemText}>{text}</Text>
                </View>
              );
            })}
        </ViewShot>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  root: {
    paddingVertical: 20,
  },
  content: {
    backgroundColor: "#fff",
  },
  item: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 22,
    color: "#666",
  },
  previewImage: {
    height: 200,
    backgroundColor: "black",
  },
});

Viewshoot.navigationOptions = {
  title: "Viewshoot",
};

export default Viewshoot;
