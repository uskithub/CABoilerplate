import { Observable } from "rxjs";
import dependencies from "../dependencies";
import { ChangedTask } from "../interfaces/backend";
import { Task } from "./task";

export default {
    observeUsersProjects: (userId: string): Observable<ChangedTask[]> => {
        return dependencies.backend.observeUsersProjects(userId);
    }
    , observeProject: (userId: string, projectId: string): Observable<Task> => {
        return dependencies.backend.observeProject(userId, projectId);
    }
};