import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("routes/home.tsx"),
    route("history", "routes/history.tsx"),
    route("archive", "routes/archive.tsx"),
    route("fax", "routes/fax.tsx"),
  ]),
] satisfies RouteConfig;
