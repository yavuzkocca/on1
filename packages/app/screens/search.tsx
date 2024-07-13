import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";
import { Search } from "app/components/search";

const SearchScreen = withColorScheme(() => {
  return (
    <View tw="w-full flex-1">
      <Search />
    </View>
  );
});

export { SearchScreen };
