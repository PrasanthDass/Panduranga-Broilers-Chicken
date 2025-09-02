import fastify from "fastify";

const server = fastify();

server.get("/", async () => {
    return "Hello from Fastify with Bun + TypeScript!";
});

server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
