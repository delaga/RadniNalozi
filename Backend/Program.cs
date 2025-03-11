using Backend.Data;
using Backend.Mapping;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

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

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(RadniNaloziMappingProfile));


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

app.UseStaticFiles();
app.UseDefaultFiles();
app.MapFallbackToFile("index.html");


app.UseCors("CorsPolicy");

app.Run();
