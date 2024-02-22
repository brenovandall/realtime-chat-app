using chat_app_api.Data.DTOs;
using chat_app_api.Services;
using Microsoft.AspNetCore.SignalR;

namespace chat_app_api.Hubs;

public class ChatHub : Hub
{
    private readonly ChatService _service;
    public ChatHub(ChatService service)
    {
        _service = service;
    }

    // método ao conectar-se 
    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "ChatAppUi");
        await Clients.Caller.SendAsync("UserConnected");
    }

    // método ao disconectar-se 
    public override async Task OnDisconnectedAsync(Exception ex)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "ChatAppUi");
        var user = _service.GetUserByConnectionId(Context.ConnectionId);
        _service.DeleteUser(user);
        await DisplayOnlineUsers();
        await base.OnDisconnectedAsync(ex);
    }

    public async Task AddUserConnectionId(string name)
    {
        // todo navegador tem um id de conexão, entao, associo o id de conexão do navegador com o nome de usuário
        _service.AddUserConnectionId(name, Context.ConnectionId);
        await DisplayOnlineUsers();
    }

     public async Task CreatePrivateChat(MessageDto message)
    {
        var privateGroupName = GetPrivateChatGroupName(message.From, message.To);
        await Groups.AddToGroupAsync(Context.ConnectionId, privateGroupName);
        var toConnectionId = _service.GetConnectionIdByUser(message.To);
        await Groups.AddToGroupAsync(toConnectionId, privateGroupName);

        await Clients.Client(toConnectionId).SendAsync("OpenPrivateChat", message);
    }

    private async Task RemovePrivateChat(string from, string to)
    {
        var privateGroupName = GetPrivateChatGroupName(from, to);
        await Clients.Group(privateGroupName).SendAsync("ClosePrivateChat");
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, privateGroupName);
        var toConnectionId = _service.GetConnectionIdByUser(to);
        await Groups.RemoveFromGroupAsync(toConnectionId, privateGroupName);
    }

    public async Task ReceivePrivateMessage(MessageDto message)
    {
        var privateGroupName = GetPrivateChatGroupName(message.From, message.To);
        await Clients.Group(privateGroupName).SendAsync("NewPrivateMessage", message);
    }

    public async Task ReceiveMessage(MessageDto message)
    {
        await Clients.Group("ChatAppUi").SendAsync("NewMessage", message);
    }

    private async Task DisplayOnlineUsers()
    {
        var onlineUsers = _service.GetOnlineUsers(); // armazena todos os usuários online
        await Clients.Groups("ChatAppUi").SendAsync("OnlineUsers", onlineUsers); // manda ao grupo criado no método "OnConnectedAsync()", uma array com todos os usuários que estão logados
    }

    private string GetPrivateChatGroupName(string from, string to)
    {
        var stringCompare = string.CompareOrdinal(from, to) < 0;
        return stringCompare ? $"{from}-{to}" : $"{to}-{from}";
    }
}
