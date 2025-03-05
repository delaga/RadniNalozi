using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class VrstaTroskaController : ControllerBase
    {
        // koristimo dependency injection
        // 1. definiramo privatno svojstvo
        private readonly RadniNaloziContext _context;
        private readonly IMapper _mapper;

        // 2. u konstruktoru postavljamo vrijednost
        public VrstaTroskaController(RadniNaloziContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var vrsteTroskova = _context.VrsteTroskova.ToList();
                return Ok(_mapper.Map<List<VrstaTroskaDTORead>>(vrsteTroskova));
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
                var vrstaTroska = _context.VrsteTroskova.Find(sifra);
                if (vrstaTroska == null)
                {
                    return NotFound(new { poruka = $"Vrsta troška s šifrom {sifra} ne postoji" });
                }
                return Ok(_mapper.Map<VrstaTroskaDTORead>(vrstaTroska));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }



        [HttpPost]
        public IActionResult Post(VrstaTroskaDTOInsertUpdate vrstaTroskaDTO)
        {
            try
            {
                var vrstaTroska = _mapper.Map<VrstaTroska>(vrstaTroskaDTO);
                _context.VrsteTroskova.Add(vrstaTroska);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<VrstaTroskaDTORead>(vrstaTroska));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, VrstaTroskaDTOInsertUpdate vrstaTroskaDTO)
        {
            try
            {

                var vrstaTroskaBaza = _context.VrsteTroskova.Find(sifra);
                if (vrstaTroskaBaza == null)
                {
                    return NotFound(new { poruka = $"Vrsta troška s šifrom {sifra} ne postoji" });
                }

                // koristimo automapper
                _mapper.Map(vrstaTroskaDTO, vrstaTroskaBaza);

                _context.VrsteTroskova.Update(vrstaTroskaBaza);
                _context.SaveChanges();
                return Ok(_mapper.Map<VrstaTroskaDTORead>(vrstaTroskaBaza));
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
                var vrstaTroska = _context.VrsteTroskova.Find(sifra);
                if (vrstaTroska == null)
                {
                    return NotFound(new { poruka = $"Vrsta troška s šifrom {sifra} ne postoji" });
                }
                _context.VrsteTroskova.Remove(vrstaTroska);
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
