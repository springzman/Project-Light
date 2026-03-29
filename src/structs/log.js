const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
    }
};

function getTimestamp() {
    const now = new Date();
    return `[${now.toLocaleTimeString()}]`;
}

module.exports = {
    backend: (message) => {
        console.log(`${colors.fg.cyan}${getTimestamp()} [BACKEND]${colors.reset} ${message}`);
    },
    xmpp: (message) => {
        console.log(`${colors.fg.magenta}${getTimestamp()} [XMPP]${colors.reset} ${message}`);
    },
    matchmaker: (message) => {
        console.log(`${colors.fg.green}${getTimestamp()} [MATCHMAKER]${colors.reset} ${message}`);
    },
    error: (message) => {
        console.log(`${colors.fg.red}${getTimestamp()} [ERROR]${colors.reset} ${message}`);
    },
    warning: (message) => {
        console.log(`${colors.fg.yellow}${getTimestamp()} [WARNING]${colors.reset} ${message}`);
    },
    info: (message) => {
        console.log(`${colors.fg.blue}${getTimestamp()} [INFO]${colors.reset} ${message}`);
    },
    debug: (message) => {
        console.log(`${colors.fg.gray}${getTimestamp()} [DEBUG]${colors.reset} ${message}`);
    }
};
