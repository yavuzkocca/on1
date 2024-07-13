import { withColorScheme } from "app/components/memo-with-theme";
import { Settings } from "app/components/settings";

const SettingsScreen = withColorScheme(() => {
  return <Settings />;
});

export { SettingsScreen };
