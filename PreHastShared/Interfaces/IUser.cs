using PreHast.Server.DTO;


namespace PreHastShared.Interfaces
{
    public interface IUser
    {

        Task<bool> CreateUserAsync(CrudVardPersonal dto);
        Task<bool> UpdateUserAsync(string Id, CrudVardPersonal dto);
        Task<bool> LockInOutAsync( string UserId);
        Task<bool> SetPasswordAsync( string Id);
        Task<string> SetPasswordNewAsync( resetPass respass);
        Task<LoginResponse> LoginAsync(LoginDto dto);
        Task<string> RefreshTokenAsync(RefreshTokenRequest refreshTokenRequest);
        Task<string> GetCurrentUserId();
    }
}
