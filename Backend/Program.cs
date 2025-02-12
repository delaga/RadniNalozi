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

var app = builder.Build();

// Configure the HTTP request pipeline.

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

app.Run();
