using AutoMapper;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{

    public abstract class EdunovaController : ControllerBase
    {

        // dependecy injection
        // 1. definiraš privatno svojstvo
        protected readonly RadniNaloziContext _context;

        protected readonly IMapper _mapper;


        // dependecy injection
        // 2. proslijediš instancu kroz konstruktor
        public EdunovaController(RadniNaloziContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

    }
}