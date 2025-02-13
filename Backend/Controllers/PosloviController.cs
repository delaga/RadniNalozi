using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PosloviController : ControllerBase
    {
        private readonly RadniNaloziContext _context;

        public PosloviController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Poslovi.ToList());
        }

        [HttpPost]
        public IActionResult Post(Posao posao)
        {
            _context.Poslovi.Add(posao);
            _context.SaveChanges();
            return Ok(posao);
        }

        [HttpPut("{sifra}")]
        public IActionResult Put(int sifra, Posao posao)
        {
            var postojeciPosao = _context.Poslovi.Find(sifra);
            if (postojeciPosao == null)
            {
                return BadRequest("Posao nije pronađen");
            }

            postojeciPosao.NazivPosla = posao.NazivPosla;
            postojeciPosao.Vrijednost = posao.Vrijednost;

            _context.SaveChanges();
            return Ok(postojeciPosao);
        }

        [HttpDelete("{sifra}")]
        public IActionResult Delete(int sifra)
        {
            var posao = _context.Poslovi.Find(sifra);
            if (posao == null)
            {
                return BadRequest("Posao nije pronađen");
            }

            _context.Poslovi.Remove(posao);
            _context.SaveChanges();
            return Ok();
        }
    }
}
