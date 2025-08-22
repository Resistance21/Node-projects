import MyFramework from "../myFramework.js";
const SESSIONS = [];
const USERS = [
    { id: 1, name: "Liam Brown", username: "liam23", password: "string" },
    { id: 2, name: "Meredith Green", username: "merit.sky", password: "string" },
    { id: 3, name: "Ben Adams", username: "ben.poet", password: "string" },
];
const POSTS = [
    {
        id: 1,
        title: "This is a post title",
        body: "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        userId: 1,
    },
];
const server = new MyFramework();
server.beforeRoute((req, res, next) => {
    const routesToAuth = [
        "get /api/user",
        "put /api/user",
        "post /api/posts",
        "delete /api/logout",
    ];
    if (req.method && req.url) {
        if (routesToAuth.includes(req.method?.toLocaleLowerCase() + " " + req.url)) {
            if (req.headers.cookie) {
                const token = req.headers.cookie?.split("=")[1];
                const session = SESSIONS.find((ses) => ses.session === token);
                if (!session)
                    return res.status(404).json({ message: "invalid session" });
                req.userId = session.userID;
                return next();
            }
            else {
                return res.status(404).json({ message: "invalid session" });
            }
        }
    }
    next();
});
server.beforeRoute((req, res, next) => {
    if (req.headers["content-type"] === "application/json") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const bodyJson = JSON.parse(body);
            req.body = bodyJson;
            return next();
        });
    }
    else {
        next();
    }
});
server.beforeRoute((req, res, next) => {
    const routes = ["/", "/login", "/new-post", "/profile"];
    if (routes.find((route) => route === req.url) && req.method === "GET") {
        server.route(`${req.method.toLocaleLowerCase()}`, `${req.url}`, (req, res) => {
            return res.sendFile("./public/index.html", "text/html");
        });
    }
    next();
});
server.route("get", "/styles.css", (req, res) => {
    res.sendFile("./public/styles.css", "text/css");
});
server.route("get", "/scripts.js", (req, res) => {
    res.sendFile("./public/scripts.js", "application/javascript");
});
server.route("get", "/api/posts", (req, res) => {
    const posts = POSTS.map((post) => {
        const user = USERS.find((user) => user.id === post.userId);
        return { ...post, author: user?.name };
    });
    res.status(200).json(posts);
});
server.route("post", "/api/posts", (req, res) => {
    const post = req.body;
    const userID = req.userId;
    if (userID)
        POSTS.push({
            id: POSTS.length + 1,
            title: post.title,
            body: post.body,
            userId: userID,
        });
    res.status(200).json({ message: "post added" });
});
server.route("get", "/login", (req, res) => {
    res.sendFile("./public/index.html", "text/html");
});
server.route("post", "/api/login", (req, res) => {
    const body = req.body;
    if (body) {
        const foundUser = USERS.find((user) => user.username === body.username && user.password === body.password);
        if (!foundUser)
            return res.status(404).json({ message: "User not found" });
        const token = Math.floor(Math.random() * 10000000).toString();
        SESSIONS.push({ userID: foundUser.id, session: token });
        res.setHeader("set-cookie", `token=${token}; path=/;`);
        res
            .status(200)
            .json({ message: "User found, logging in", user: foundUser });
    }
});
server.route("get", "/api/user", (req, res) => {
    const user = USERS.find((user) => user.id === req.userId);
    res.status(200).json({ username: user?.username, name: user?.name });
});
server.route("put", "/api/user", (req, res) => {
    const userIndex = USERS.findIndex((user) => user.id === req.userId);
    if (userIndex !== -1) {
        const user = USERS.find((user) => user.id === req.userId);
        const body = req.body;
        if (user) {
            if (body.name)
                user.name = body.name;
            if (body.password)
                user.password = body.password;
            if (body.username)
                user.username = body.username;
            USERS[userIndex] = user;
        }
        res.status(200).json({ message: "User details updated" });
    }
    else {
        res.status(404).json({ message: "Error finding user" });
    }
});
server.route("delete", "/api/logout", (req, res) => {
    const sessionIndex = SESSIONS.findIndex((session) => session.userID === req.userId);
    if (sessionIndex > -1) {
        SESSIONS.splice(sessionIndex, 1);
    }
    res.setHeader("Set-Cookie", `token=deleted; Path=/; Expires=thu, 01 Jan 1970 00:00:00 GMT`);
    res.status(200).json({ message: "Logged out" });
});
server.listen(9000, () => {
    console.log(`server running`);
});
//# sourceMappingURL=server.js.map