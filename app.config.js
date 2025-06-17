import 'dotenv/config';

export default {
  expo: {
    name: "MyApp",
    slug: "myapp",
    extra: {
      LOCATIONIQ_API_KEY: process.env.LOCATIONIQ_API_KEY,
    }
  }
};