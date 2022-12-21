export const TreenodeType = {
    root: "root" 
    , descendant : "descendants"
} as const;

export type TreenodeType = typeof TreenodeType[keyof typeof TreenodeType];

export interface Treenode {
    id: string;
    name: string;
    // styleClass: object|null;
    // content: object;
    subtrees: Treenode[];
    isDraggable: boolean;
    isFolding: boolean;
};

export class TaskTreenode implements Treenode {
    _id: string;
    _name: string;
    _subtrees: TaskTreenode[];
    _isDraggable: boolean;
    _isFolding: boolean;

    constructor(id: string, name: string, subtrees: TaskTreenode[], isDraggable: boolean, isFolding: boolean) {
        this._id = id;
        this._name = name;
        this._subtrees = subtrees;
        this._isDraggable = isDraggable;
        this._isFolding = isFolding;
    }

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get subtrees(): TaskTreenode[] { return this._subtrees; }
    get isDraggable(): boolean { return this._isDraggable; }
    get isFolding(): boolean { return this._isFolding; }
}
