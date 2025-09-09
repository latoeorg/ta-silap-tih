import App from "./lib/server";

const app = new App();
const express = app.express;

const PORT = process.env.PORT || 3001;
express.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
