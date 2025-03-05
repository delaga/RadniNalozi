using AutoMapper;
using Backend.Models;
using Backend.Models.DTO;

namespace Backend.Mapping
{
    public class RadniNaloziMappingProfile : Profile
    {
        public RadniNaloziMappingProfile()
        {
            // Klijent mappings
            CreateMap<Klijent, KlijentDTORead>();
            CreateMap<KlijentDTOInsertUpdate, Klijent>();
            CreateMap<Klijent, KlijentDTOInsertUpdate>();
            
            // Možemo dodati ostala mapiranja za druge entitete po potrebi
        }
    }
}
