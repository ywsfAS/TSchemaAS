 /**
  * Base abstraction for schema refinements.
  *
  * A refinement encapsulates an additional validation rule that is applied
  * after the underlying schema successfully validates a value.
  *
  * @typeParam T The type of value validated by the refinement.
  */
export abstract class Refinement<T> {
    private _message : string;
    /**
    * Checks whether a value satisfies the refinement rule.
    *
    * @param value The value to validate.
    * @returns `true` when the value satisfies the refinement; otherwise, `false`.
    */
    abstract check(value : T) : boolean;

    /**
    * Creates a refinement with an associated validation error message.
    *
    * @param msg Error message used when the refinement fails.
    */
    constructor(msg : string){
        this._message = msg;
    }
    /**
    * Gets the error message associated with this refinement.
    *
    * @returns The validation error message.
    */
    get message() : string {
        return this._message;
    }
}
