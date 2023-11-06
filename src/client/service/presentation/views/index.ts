// service
import Home from "@views/Home.vue";
import SignIn from "@views/SignIn.vue";
import SignUp from "@views/SignUp.vue";
import Chat from "@views/home/Chat.vue";
import Task from "@views/home/Task.vue";
// import ProjectList from "@views/home/ProjectList.vue";
import Project from "@views/home/Project.vue";
import Warranty from "@views/home/Warranty.vue";
import Insuranace from "./home/Insuranace.vue";

export const routes = [
    {
        path: "/", component: Home, children: [
            { path: "", component: Chat }
            , { path: "/tasks", component: Task }
            // , { path: "/projects", component: ProjectList }
            , { path: "/projects/:projectId", component: Project }
            , { path: "/warranties", component: Warranty }
            , { path: "/insuranceItems", component: Insuranace }
        ]
    }
    , { path: "/signin", component: SignIn }
    , { path: "/signup", component: SignUp }
];