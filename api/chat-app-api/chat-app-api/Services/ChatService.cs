namespace chat_app_api.Services;

public class ChatService
{
    // par key value, ex: { { "user": "breno" , "connectionId": "id" } }
    private static readonly Dictionary<string, string> Users = new();

    public bool AddUserToList(string userToAdd)
    {
        lock (Users) // impede de adicionar dois usuário ao mesmo tempo
        {
            // verifica se o user existe
            foreach(var user in Users)
            {
                if (user.Key.ToLower() == userToAdd.ToLower()) return false;
            }
        }

        Users.Add(userToAdd, null); // adiciona na coleção
        return true;
    }

    public void AddUserConnectionId(string user, string connectionId)
    {
        lock (Users)
        {
            if(Users.ContainsKey(user))
            {
                // recebe um identificador
                Users[user] = connectionId;
            }
        }
    }

    public string GetUserByConnectionId(string connectionId) 
    {
        lock (Users)
        {
            // retorna o usuário a partir do connectionId
            return Users
                    .Where(x => x.Value == connectionId)
                    .Select(x => x.Key)
                    .FirstOrDefault();
        }
    }

    public string GetConnectionIdByUser(string user)
    {
        lock (Users)
        {
            // retorna o usuário a partir do nome de usuario
            return Users
                    .Where(x => x.Key == user)
                    .Select(x => x.Value)
                    .FirstOrDefault();
        }
    }

    public string DeleteUser(string user)
    {
        lock (Users)
        {
            // deleta o usuario
            if( Users.ContainsKey(user) )
            {
                Users.Remove(user);
            }

            return String.Empty;
        }
    }

    public string[] GetOnlineUsers()
    {
        lock (Users)
        {
            // lista todos os usuário online
            return Users
                    .OrderBy(x => x.Key)
                    .Select(x => x.Key)
                    .ToArray();
        }
    }
}
