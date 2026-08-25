import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3001);

const server = app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

export { server };
