using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VrsteTroskovaController : ControllerBase
    {
        private readonly RadniNaloziContext _context;

        public VrsteTroskovaController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.VrsteTroskova.ToList());
        }

        [HttpPost]
        public IActionResult Post(VrstaTroska vrstaTroska)
        {
            _context.VrsteTroskova.Add(vrstaTroska);
            _context.SaveChanges();
            return Ok(vrstaTroska);
        }

        [HttpPut("{sifra}")]
        public IActionResult Put(int sifra, VrstaTroska vrstaTroska)
        {
            var postojecaVrsta = _context.VrsteTroskova.Find(sifra);
            if (postojecaVrsta == null)
            {
                return BadRequest("Vrsta troška nije pronađena");
            }

            postojecaVrsta.Naziv = vrstaTroska.Naziv;
            _context.SaveChanges();
            return Ok(postojecaVrsta);
        }

        [HttpDelete("{sifra}")]
        public IActionResult Delete(int sifra)
        {
            var vrsta = _context.VrsteTroskova.Find(sifra);
            if (vrsta == null)
            {
                return BadRequest("Vrsta troška nije pronađena");
            }

            _context.VrsteTroskova.Remove(vrsta);
            _context.SaveChanges();
            return Ok();
        }
    }
}
