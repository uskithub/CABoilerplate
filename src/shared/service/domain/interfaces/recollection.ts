
export interface Recollector {
    larn(documents: string): Promise<void>
}