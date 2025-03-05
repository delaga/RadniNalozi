using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class KlijentController : ControllerBase
    {
        // koristimo dependency injection
        // 1. definiramo privatno svojstvo
        private readonly RadniNaloziContext _context;
        private readonly IMapper _mapper;

        // 2. u konstruktoru postavljamo vrijednost
        public KlijentController(RadniNaloziContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var klijenti = _context.Klijenti.ToList();
                return Ok(_mapper.Map<List<KlijentDTORead>>(klijenti));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpGet("{sifra:int}")]
        public IActionResult Get(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new {poruka= "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var klijent = _context.Klijenti.Find(sifra);
                if (klijent == null)
                {
                    return NotFound(new { poruka = $"Klijent s šifrom {sifra} ne postoji" });
                }
                return Ok(_mapper.Map<KlijentDTORead>(klijent));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }



        [HttpPost]
        public IActionResult Post(KlijentDTOInsertUpdate klijentDTO)
        {
            try
            {
                var klijent = _mapper.Map<Klijent>(klijentDTO);
                _context.Klijenti.Add(klijent);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<KlijentDTORead>(klijent));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, KlijentDTOInsertUpdate klijentDTO)
        {
            try
            {

                var klijentBaza = _context.Klijenti.Find(sifra);
                if (klijentBaza == null)
                {
                    return NotFound(new { poruka = $"Klijent s šifrom {sifra} ne postoji" });
                }

                // koristimo automapper
                _mapper.Map(klijentDTO, klijentBaza);

                _context.Klijenti.Update(klijentBaza);
                _context.SaveChanges();
                return Ok(_mapper.Map<KlijentDTORead>(klijentBaza));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpDelete("{sifra:int}")]
        public IActionResult Delete(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { poruka = "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var klijent = _context.Klijenti.Find(sifra);
                if (klijent == null)
                {
                    return NotFound(new { poruka = $"Klijent s šifrom {sifra} ne postoji" });
                }
                _context.Klijenti.Remove(klijent);
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}
