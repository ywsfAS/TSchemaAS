import type { Issue } from "../types.js"

export class ErrorSchema extends Error {

    private  _issues : Issue[] = [];
    constructor(){
        super("Validation failed");
        this.name = "SchemaError";
    }

    get issues() : readonly Issue[]{
        return structuredClone(this._issues);
    }

    public addIssue(issue : Issue) : void {
        this._issues.push(issue);
    }
    public clear() : void {
        this._issues = [];
    }
    public isEmpty() : boolean {
        return this._issues.length === 0;
    }


}
