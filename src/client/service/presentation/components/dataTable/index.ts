// @see https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/util/helpers.ts#L71-L75
export type SelectItemKey =
  | boolean // Ignored
  | string // Lookup by key, can use dot notation for nested objects
  | (string | number)[] // Nested lookup by key, each array item is a key in the next level
  | ((item: Record<string, any>, fallback?: any) => any)

// @see https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/labs/VDataTable/types.ts#L4-L23
export type DataTableCompareFunction<T = any> = (a: T, b: T) => number
export type DataTableHeader = {
    key: string
    value?: SelectItemKey
    title: string
  
    colspan?: number
    rowspan?: number
  
    fixed?: boolean
    align?: 'start' | 'end'
  
    width?: number
    minWidth?: string
    maxWidth?: string
  
    sortable?: boolean
    sort?: DataTableCompareFunction
  }

  
export enum SortOrder {
    asc, desc
};

export enum Align {
    left, center, right
};

export type Header = {
    text: string;
    value: number|string|Date;
    sorted: SortOrder|undefined;
    align: Align;
};

export type Action = {
    action: string;
    event: string;
    disabled: boolean;
}