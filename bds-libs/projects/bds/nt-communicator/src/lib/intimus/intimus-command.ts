export class IntimusCommand {
    private _command: IntimusCommands;
    private _params; IntimusCommandParams;

    constructor(command: string, params: any) {
        this._command = IntimusCommands[command];
        this._params = params;
    }

    public get command(): IntimusCommands {
        return this._command;
    }

    public set command(command: IntimusCommands) {
        this._command = command;
    }

    public get params(): IntimusCommandParams {
        return this._params;
    }

    public set params(params: IntimusCommandParams) {
        this._params = params;
    }
}

export enum IntimusCommands {
    RefreshAttivita,
    ShowMessage
}

export interface IntimusCommandParams {
}

export interface ShowMessageParams extends IntimusCommandParams {
    messageId: number;
    title: string;
    body: string;
    severity: string;
    rescheduleInterval: number;
    type: string;
    invasivity: string;
}

export interface RefreshAttivitaParams extends IntimusCommandParams {
    id_attivita: number;
    operation: string;
}
