import { withColorScheme } from "app/components/memo-with-theme";
import { Trending } from "app/components/trending";

const TrendingScreen = withColorScheme(() => {
  return <Trending />;
});

export { TrendingScreen };
