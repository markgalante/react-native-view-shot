import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import screens, { type Screens } from "./src/screens";

type HomeScreenProps = {
  route: RouteProp<ParamListBase, "Home2">;
  navigation: any;
};

function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView>
          {Object.keys(screens).map((key: any) => (
            <TouchableOpacity
              key={key as Screens}
              onPress={() => navigation.navigate(key)}
            >
              <View style={styles.entry}>
                <Text style={styles.entryText}>
                  {screens[key as Screens].screen.navigationOptions.title ??
                    key}
                  {screens[key as unknown as Screens].screen.navigationOptions
                    .title
                    ? screens[key as Screens].screen.navigationOptions.title
                    : key}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  entry: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  entryText: {
    fontSize: 22,
    color: "#36f",
  },
});

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "react-native-view-shot " + "4.0.0" }}
        />
        {Object.keys(screens).map((key: unknown) => (
          <Stack.Screen
            key={key as Screens}
            name={key as Screens}
            component={screens[key as Screens].screen}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
