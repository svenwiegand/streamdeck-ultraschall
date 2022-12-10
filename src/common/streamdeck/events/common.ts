export interface Event {
    event: string
}

export type EventHandler<E extends Event> = (e: E) => void