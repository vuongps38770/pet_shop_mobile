import 'dotenv/config';

export default {
  expo: {
    name: "MyApp",
    slug: "myapp",
    scheme:"petshop",
    extra: {
      LOCATIONIQ_API_KEY: process.env.LOCATIONIQ_API_KEY,
    },
    android: {
      package: "com.qvdz.myapp",
    },
  }
};