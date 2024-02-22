using chat_app_api.Data.DTOs;
using chat_app_api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace chat_app_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ChatController : ControllerBase
{
    // dependencias:
    private readonly ChatService _service;

    public ChatController(ChatService service)
    {
        _service = service;
    }

    [HttpPost]
    [Route("register/user")]
    public IActionResult RegisterUser(UserDTO user)
    {
        if (_service.AddUserToList(user.Name)) return NoContent(); // 204

        return BadRequest();
    }
}
