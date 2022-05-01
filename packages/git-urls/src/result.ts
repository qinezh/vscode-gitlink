import { GitUrlError } from "./error";

export interface GitRemote {
    name: string;
    url: string;
}

export type GitUrlResult = Ok<GitRemote, GitUrlError> | Err<GitRemote, GitUrlError>;
export const ok = <T, E = never>(value: T): Ok<T, E> => new Ok(value);
export const err = <T = never, E = unknown>(error: E): Err<T, E> => new Err(error);

// Copied from https://github.com/supermacro/neverthrow/blob/master/src/result.ts
interface IResult<T, E> {
    isOk(): this is Ok<T, E>;
    isErr(): this is Err<T, E>;
    _unsafeUnwrap(): T;
}

class Ok<T, E> implements IResult<T, E> {
    constructor(readonly value: T) {}

    isOk(): this is Ok<T, E> {
        return true;
    }

    isErr(): this is Err<T, E> {
        return false;
    }

    _unsafeUnwrap(): T {
        return this.value;
    }
}

class Err<T, E> implements IResult<T, E> {
    constructor(readonly error: E) {}

    isOk(): this is Ok<T, E> {
        return false;
    }

    isErr(): this is Err<T, E> {
        return true;
    }

    _unsafeUnwrap(): T {
        throw this.error;
    }
}
