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
    route("voicemail", "routes/voicemail.tsx"),
    route("archive", "routes/archive.tsx", [
      route("calls", "routes/archive.calls.tsx"),
      route("voicemails", "routes/archive.voicemails.tsx"),
      route("fax", "routes/archive.fax.tsx"),
    ]),
    route("fax", "routes/fax.tsx"),
  ]),
  route("api/history-update", "routes/api/history-update.ts"),
] satisfies RouteConfig;
