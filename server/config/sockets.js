module.exports = (io) => {
    // setup connection with users
    io.on("connection", (socket) => {
        // vendor and client join same room (orderId) to communicate
        socket.on("join", (id) => {
            socket.join(id);
        });
        socket.on("error", (err) => {
            console.log(err);
        });
    });
};
