export class Logger {
    Log(msg: string) {
        console.log(msg);
    }

    Error(msg: string | unknown) {
        console.error(msg);
    }
}


