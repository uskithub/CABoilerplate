// service
import Home from "@views/Home.vue";
import Profile from "@views/Profile.vue";
import SignIn from "@views/SignIn.vue";
import SignUp from "@views/SignUp.vue";
import Timeline from "@views/home/Timeline.vue";
import Chat from "@views/home/Chat.vue";
import Task from "@views/home/Task.vue";
// import ProjectList from "@views/home/ProjectList.vue";
import Project from "@views/home/Project.vue";
import Warranty from "@views/home/Warranty.vue";
import Insuranace from "./home/Insuranace.vue";

export const routes = [
    {
        path: "/", component: Home, children: [
            { path: "", component: Timeline }
            , { path: "/tasks", component: Task }
            // , { path: "/projects", component: ProjectList }
            // 以下で string | string[] を string に変換できると思ったけど、使う方では型が変わらなかった
            // , { path: "/projects/:projectId", component: Project, props: (route: RouteLocationNormalizedLoaded) => ({ projectId: (Array.isArray(route.params.projectId)) ? route.params.projectId[0] : route.params.projectId }) }
            , { path: "/projects/:projectId", component: Project }
            , { path: "/warranties", component: Warranty }
            , { path: "/insuranceItems", component: Insuranace }
            , { path: "/profile", component: Profile }
        ]
    }
    , { path: "/signin", component: SignIn }
    , { path: "/signup", component: SignUp }
];