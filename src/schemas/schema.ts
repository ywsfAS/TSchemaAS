export interface Schema<T> {
    parse(value : unknown) : T
};
