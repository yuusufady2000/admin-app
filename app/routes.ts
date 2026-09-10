import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("detailView/:id", "./routes/detailView/view.tsx")       
] satisfies RouteConfig;
