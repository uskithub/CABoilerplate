
export interface Adviser {
    input(): Promise<void>
    output(): Promise<string>
}