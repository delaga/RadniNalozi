using Backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// dodati swagger
builder.Services.AddSwaggerGen();


// dodavanje db contexta
builder.Services.AddDbContext<RadniNaloziContext>(o => {
    o.UseSqlServer(builder.Configuration.GetConnectionString("RadniNaloziContext"));
});



//preduvijet za rad u Frontendu

builder.Services.AddCors(o =>
{
    o.AddPolicy("CorsPolicy", b => 
    {
        b.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    });

});



var app = builder.Build();

// Add test endpoint
app.MapGet("/test-db", async (RadniNaloziContext context) => 
{
    try
    {
        await context.Database.CanConnectAsync();
        return Results.Ok("Database connection successful");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Database connection failed: {ex.Message}");
    }
});

// Configure the HTTP request pipeline
app.MapOpenApi();



app.UseHttpsRedirection();

app.UseAuthorization();

// swagger sucelje
app.UseSwagger();
app.UseSwaggerUI(o =>
{
    o.EnableTryItOutByDefault();
    o.ConfigObject.AdditionalItems.Add("requestSnippetsEnabled", true);
});

app.MapControllers();

app.UseStaticFiles();
app.UseDefaultFiles();
app.MapFallbackToFile("index.html");


app.UseCors("CorsPolicy");

app.Run();
