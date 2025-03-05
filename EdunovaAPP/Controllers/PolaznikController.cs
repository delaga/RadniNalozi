using AutoMapper;
using EdunovaAPP.Data;
using EdunovaAPP.Models;
using EdunovaAPP.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace EdunovaAPP.Controllers
{

    [ApiController]
    [Route("api/v1/[controller]")]
    public class PolaznikController(EdunovaContext context, IMapper mapper) : EdunovaController(context, mapper)
    {


        // RUTE
        [HttpGet]
        public ActionResult<List<PolaznikDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                return Ok(_mapper.Map<List<PolaznikDTORead>>(_context.Polaznici));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

        }


        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<PolaznikDTOInsertUpdate> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Polaznik? e;
            try
            {
                e = _context.Polaznici.Find(sifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Polaznik ne postoji u bazi" });
            }

            return Ok(_mapper.Map<PolaznikDTOInsertUpdate>(e));
        }

        [HttpPost]
        public IActionResult Post(PolaznikDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var e = _mapper.Map<Polaznik>(dto);
                _context.Polaznici.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<PolaznikDTORead>(e));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }



        }

        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, PolaznikDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Polaznik? e;
                try
                {
                    e = _context.Polaznici.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Polaznik ne postoji u bazi" });
                }

                e = _mapper.Map(dto, e);

                _context.Polaznici.Update(e);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno promjenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

        }

        [HttpDelete]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Delete(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Polaznik? e;
                try
                {
                    e = _context.Polaznici.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound("Polaznik ne postoji u bazi");
                }
                _context.Polaznici.Remove(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno obrisano" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet]
        [Route("trazi/{uvjet}")]
        public ActionResult<List<PolaznikDTORead>> TraziPolaznik(string uvjet)
        {
            if (uvjet == null || uvjet.Length < 3)
            {
                return BadRequest(ModelState);
            }
            uvjet = uvjet.ToLower();
            try
            {
                IEnumerable<Polaznik> query = _context.Polaznici;
                var niz = uvjet.Split(" ");
                foreach (var s in uvjet.Split(" "))
                {
                    query = query.Where(p => p.Ime.ToLower().Contains(s) || p.Prezime.ToLower().Contains(s));
                }
                var polaznici = query.ToList();
                return Ok(_mapper.Map<List<PolaznikDTORead>>(polaznici));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }


    }
}
