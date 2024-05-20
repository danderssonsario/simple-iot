using backend;
using System.Net.WebSockets;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
// builder.Services.AddSingleton<WebSocketService>();
var app = builder.Build();

// List to store connected WebSocket clients
var webSockets = new List<WebSocket>();

app.UseWebSockets();

app.MapGet("/ws", async (HttpContext context) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        var user = context.User.Identity.Name;
        var ipAddress = context.Connection.RemoteIpAddress?.ToString();
        Console.WriteLine($"User {user}, connected to WebSocket.");

        // Add the new WebSocket client to the list
        webSockets.Add(webSocket);

        // Send the count of connected clients to the newly connected client
        await SendClientCountAsync();

        // Handle WebSocket messages
        while (webSocket.State == WebSocketState.Open)
        {
            var buffer = new byte[1024 * 4];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            if (result.MessageType == WebSocketMessageType.Text)
            {
                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine($"Received message from client: {message}");

                // Broadcast the message to all other WebSocket clients
                foreach (var client in webSockets.Where(c => c != webSocket && c.State == WebSocketState.Open))
                {
                    await client.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(message)), WebSocketMessageType.Text, true, CancellationToken.None);
                }
            }
        }

        // Remove the WebSocket client from the list when the connection is closed
        webSockets.Remove(webSocket);

        // Send updated count of connected clients to all remaining clients
        await SendClientCountAsync();
    }
    else
    {
        context.Response.StatusCode = 400;
        await context.Response.WriteAsync("Expected a WebSocket request");
    }
});

async Task SendClientCountAsync()
{
    var countMessage = $"{{\"count\": {webSockets.Count}}}";
    foreach (var client in webSockets)
    {
        if (client.State == WebSocketState.Open)
        {
            await client.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(countMessage)), WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}

await app.RunAsync();
