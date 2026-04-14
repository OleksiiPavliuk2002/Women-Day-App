import { AppRegistry } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import App from "./App";

function RootApp() {
  return (
    <RootSiblingParent>
      <App />
    </RootSiblingParent>
  );
}

AppRegistry.registerComponent("main", () => RootApp);