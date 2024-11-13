Deno.serve((req) => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", () => {
    console.log("A client just connected!");
  });

  socket.addEventListener("message", (event) => {
    if (event.data === "hey") {
      console.log("A client said hay so replying with yo!");
      socket.send("yo");
    }
  });

  socket.addEventListener("open", () => {
    console.log("A client just disconnected!");
  });

  return response;
});
