// From:
// https://stackoverflow.com/questions/76649399/how-to-handle-http-and-websocket-connections-on-the-same-port-in-a-deno-server

// Accept TCP connections over port 8080
for await (const connection of Deno.listen({ port: 8080 })) {
  // Split off a dedicated asynchronous loop
  (async () => {
    // Process all the arriving requests
    for await (const requestEvent of Deno.serveHttp(connection)) {
      // Check for the presence of an upgrade header
      if (requestEvent.request.headers.get("upgrade") === "websocket") {
        // Provide a WebSocket connection
        const { socket, response } = Deno.upgradeWebSocket(
          requestEvent.request
        );
        socket.addEventListener("message", (e) => {
          console.log(e.data);
        });
        requestEvent.respondWith(response);
      } else {
        // Otherwise just respond normally
        requestEvent.respondWith(new Response("Hello!"));
      }
    }
  })();
}
