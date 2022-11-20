import { Callback } from './types';
export declare function registerHook(list: Callback[], fn: Callback): () => void;
export declare function runQueue(queue: Callback[], fn: Callback, cb: Callback): void;
