/* eslint-disable no-extend-native */
/* eslint-disable no-caller */
process.env.NO_PROXY = "*";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

Object.defineProperty(Array.prototype, "chunk", {
    value: function (n) {
        return Array.from(Array(Math.ceil(this.length / n)), (_, i) => this.slice(i * n, i * n + n));
    }
});

Object.defineProperty(Array.prototype, "chunkInefficient", {
    value: function (chunkSize) {
        const array = this;
        return [].concat.apply([],
            array.map(function (elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
            })
        );
    }
});

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
};
Object.defineProperty(global, "__stack", {
    get: function () {
        const orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) { return stack; };
        const error = new Error();
        Error.captureStackTrace(error, arguments.callee);
        const stack = error.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, "__line", {
    get: function (num) {
        return __stack[num || 1].getLineNumber();
    }
});

Object.defineProperty(global, "__file", {
    get: function (num) {
        const filePieces = __stack[num || 1].getFileName().split(/[\\/]/).slice(-1)[0].split(".");
        return filePieces.slice(0, filePieces.length - 1).join(".");
    }
});

Object.defineProperty(global, "__ext", {
    get: function (num) {
        return __stack[num || 1].getFileName().split(".").slice(-1)[0];
    }
});

Object.defineProperty(global, "__func", {
    get: function () {
        return arguments.callee.caller ? arguments.callee.caller.name : "global";
    }
});

Object.defineProperty(global, "__base", {
    get: function () {
        return process.cwd();
    }
});

Object.defineProperty(global, "__fili", {
    get: function (num) {
        let filid = ":";
        if (typeof global.__filid !== "undefined" && global.__filid) {
            filid = global.__filid;
        }

        return __stack[num || 1].getFileName() + filid + __stack[num || 1].getLineNumber();
    }
});
const { setTypeParser, builtins } = require("pg").types;
const moment = require("moment");
setTypeParser(20, "text", parseInt);
setTypeParser(builtins.DATE, val => moment(val).format("YYYY-MM-DD"));
setTypeParser(builtins.TIME, val => moment(val, "HH:mm:ss", true).format("HH:mm:ss"));
setTypeParser(builtins.TIMETZ, val => moment(val, "HH:mm:ss", true).format("HH:mm:ss"));
setTypeParser(builtins.TIMESTAMP, val => moment(val).format("YYYY-MM-DD HH:mm:ss"));
setTypeParser(builtins.TIMESTAMPTZ, val => moment(val).format("YYYY-MM-DD HH:mm:ss"));
setTypeParser(builtins.INT8, "text", parseInt);
