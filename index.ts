import { API } from "./src/api";

const api = new API({
  user: "#76",
  password: "WeShouldTotallyChangeThis",
  port: 4204,
});
(async () => {
  const res = await api.get("who");
  console.log(res);
})();
