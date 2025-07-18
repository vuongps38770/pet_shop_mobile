import 'dotenv/config';

export default {
  expo: {
    name: "MyApp",
    slug: "myapp",
    scheme:"petshop",
    extra: {
      LOCATIONIQ_API_KEY: process.env.LOCATIONIQ_API_KEY,
      BASE_URL: process.env.BASE_URL,
      SOCKET_URL : process.env.SOCKET_URL,
      OAUTH_URL : process.env.OAUTH_URL
    },
    android: {
      package: "com.qvdz.myapp",
    },
  }
};