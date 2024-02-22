using System.ComponentModel.DataAnnotations;

namespace chat_app_api.Data.DTOs;

public class UserDTO
{
    [Required]
    [StringLength(15, MinimumLength = 3, ErrorMessage = "O nome deve conter pelo menos 3 " +
        "caracteres e no máximo 15 caracteres")]
    public string Name { get; set; }
}
