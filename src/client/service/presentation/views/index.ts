// service
import Home from "@views/Home.vue";
import SignIn from "@views/SignIn.vue";
import SignUp from "@views/SignUp.vue";
import Task from "@views/home/Task.vue";
import Warranty from "@views/home/Warranty.vue";
import Insuranace from "./home/Insuranace.vue";

export const routes = [
    {
        path: "/", component: Home, children: [
            { path: "", component: Task }
            , { path: "/warranties", component: Warranty }
            , { path: "/insuranceItems", component: Insuranace }
        ]
    }
    , { path: "/signin", component: SignIn }
    , { path: "/signup", component: SignUp }
];
