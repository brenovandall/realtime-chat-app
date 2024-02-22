﻿using System.ComponentModel.DataAnnotations;

namespace chat_app_api.Data.DTOs;

public class MessageDto
{
    [Required]
    public string From { get; set; }
    public string To { get; set; }
    [Required]
    public string Content { get; set; }
}
