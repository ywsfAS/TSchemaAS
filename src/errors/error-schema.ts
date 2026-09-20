import type { Issue } from "../types.js"

/**
 * Represents validation errors collected during schema parsing.
 *
 * Stores all validation issues encountered during a parse operation and
 * provides methods for inspecting, managing, and displaying them.
 */
export class ErrorSchema extends Error {

    private  _issues : Issue[] = [];
    /**
    * Creates an empty validation error.
    */
    constructor(){
        super("Validation failed");
        this.name = "SchemaError";
    }
    /**
    * Returns a copy of all validation issues.
    *
    * The returned array is read-only and does not expose the internal
    * collection used by the error.
    */
    get issues() : readonly Issue[]{
        return structuredClone(this._issues);
    }
    
    /**
     * Adds a validation issue to the error.
     *
     * @param issue The validation issue to add.
     */
    public addIssue(issue : Issue) : void {
        this._issues.push(issue);
    }
    /**
    * Removes all validation issues from the error.
    */
    public clear() : void {
        this._issues = [];
    }
    /**
    * Determines whether no validation issues have been collected.
    *
    * @returns `true` when there are no issues; otherwise, `false`.
    */
    public isEmpty() : boolean {
        return this._issues.length === 0;
    }
    /**
     * Formats the validation issues as a human-readable message.
     *
     * Object properties are represented using dot notation and array
     * indexes using bracket notation.
     *
     * @returns A formatted string containing all validation issues.
     *
     * @example
     * ```text
     * Validation failed:
     * - user.email: Invalid email format
     * - scores[1]: Score cannot be negative
     * ```
     */
    public format(): string {
        if (this.issues.length === 0) {
            return "Validation succeeded";
        }

        return [
            "Validation failed:",
            ...this.issues.map(issue => {
                const path = issue.path
                    .map((segment, index) =>
                        typeof segment === "number"
                            ? `[${segment}]`
                            : index === 0
                                ? segment
                                : `.${segment}`
                    )
                    .join("");

                return `- ${path || "<root>"}: ${issue.message}`;
            })
        ].join("\n");
    }


}
