namespace PreHast.Server.DTO
{
    public class ResponseStatus
    {
        public string Message { get; set; }=string.Empty;
        public bool Success { get; set; }
        public int StatusCode { get; set; }
    }
}
