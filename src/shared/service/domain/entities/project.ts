import { Observable } from "rxjs";
import dependencies from "../dependencies";
import { ChangedTask } from "../interfaces/backend";

export default {
    observeUsersProjects: (userId: string): Observable<ChangedTask[]> => {
        return dependencies.backend.observeProjects(userId);
    }
};