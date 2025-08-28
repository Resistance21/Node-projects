import process, { stdout, stderr, stdin, argv } from "process";
if (argv.length > 1) {
    argv.forEach((arg, i) => {
        if (i < 2)
            return;
        stdout.write(`${arg}\n`);
    });
}
stdin.on("data", (data) => {
    stdout.write(`${data.toString()}\n`);
});
stdout.write("testing\n");
//# sourceMappingURL=cmdWrite.js.map