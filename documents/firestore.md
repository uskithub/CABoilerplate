
write = create | update | delete

```js
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, update: true;
      allow create: if request.auth != null;
      
      match /private/body {
        allow read write: if request.auth != null && request.auth.uid in resource.data.involved;
        allow read: if request.auth != null && resource.data.invitationIds != null;
      }
    }
```

```ts
interface FSTask {
    typeStatus: LayerStatusType;

    private: {
        body: {
            title: string;
            purpose: string | null;
            goal: string | null;
            instractions: string | null;
        }  
    }
    
    author: string;
    owner: string;
    assignees: Array<string>;
    members: Array<string>;
    involved: Array<string>;

    ancestorIds: string | null;
    children: Array<string>;

    startedAt?: Timestamp | undefined;
    deadline?: Timestamp | undefined;

    lastTimeWorkedAt?: Timestamp | undefined;
    updatedAt?: Timestamp | undefined;
    createdAt: Timestamp;
}
```