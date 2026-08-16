import app from "./app";
import { config } from "./config";

const PORT = Number(config.port);

app.listen(PORT, () => {
  console.log(`🚀 Squibl API running → http://localhost:${PORT}  [${config.nodeEnv}]`);
});
