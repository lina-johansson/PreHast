using PreHast.Server.Data;
using PreHast.Server.Models;
using Microsoft.EntityFrameworkCore;
using PreHast.Server.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using PreHast.Server;
using PreHastShared.Interfaces;
using PreHastShared.Services;
using PreHast.Server.Controllers;
 

var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<JWT>(builder.Configuration.GetSection("JWT"));


builder.Services.AddDbContext<PreHastDbContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("ConectionString"));
});




builder.Services.AddIdentity<VardPersonal, VardRole>()
    .AddEntityFrameworkStores<PreHastDbContext>()
    .AddSignInManager()
    .AddRoles<VardRole>();


//builder.Services.AddAuthorization(options =>
//{
//    options.AddPolicy("ApiUser", policy => policy.RequireClaim("rol", "api_access"));
//});


// JWT 
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
   // options.RequireHttpsMetadata = false;
    
    options.TokenValidationParameters = new()
    {

        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]!)),
        ClockSkew = TimeSpan.Zero,

    };
   
});
// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
//Add authentication to Swagger UI
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddScoped<IGeneral, GeneralService>();
builder.Services.AddScoped<IUser, UserService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PreHastPolicy",
 
        x => x.WithOrigins(["https://localhost:5555", "https://localhost:5556"])
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
           );
});

builder.Services.AddHttpContextAccessor(); //for get logged user
var app = builder.Build();
 
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}
app.UseCors("PreHastPolicy");
app.UseAuthentication();
app.UseAuthorization();
//app.MapIdentityApi<VardPersonal>();

app.MapControllers();

app.MapFallbackToFile("/index.html");
 

app.Run();


 