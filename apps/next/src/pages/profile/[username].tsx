import axios from "axios";

import type { Profile } from "app/types";

export async function getServerSideProps(context) {
  const { username } = context.params;
  console.log(`Username=${username}`);

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile_server/${username}`
    );
    const fallback = {
      [`/api/profile_server/${username}`]: res.data,
    };

    console.log(`USERdata=${JSON.stringify(res.data.data.profile)}`);

    const user = res.data.data.profile as Profile;
    let title;
    if (user.wallet_address) {
      title = `${user.name} (@${user.username})`;
    } else if (user.name) {
      title = user.name;
    } else if (user.username) {
      title = user.username;
    } else {
      title = user.wallet_address;
    }
    title += " | Showtime";

    if (user) {
      return {
        props: {
          fallback,
          meta: {
            title,
            description: user.bio,
            image: user.img_url,
          },
        },
      };
    }
  } catch (e) {
    console.error(e);
  }

  return {
    props: {},
  };
}

export { default } from "app/pages/profile";
