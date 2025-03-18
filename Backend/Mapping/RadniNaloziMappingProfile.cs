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
            
            // Djelatnik mappings
            CreateMap<Djelatnik, DjelatnikDTORead>();
            CreateMap<DjelatnikDTOInsertUpdate, Djelatnik>();
            CreateMap<Djelatnik, DjelatnikDTOInsertUpdate>();
            
            // VrstaTroska mappings
            CreateMap<VrstaTroska, VrstaTroskaDTORead>();
            CreateMap<VrstaTroskaDTOInsertUpdate, VrstaTroska>();
            CreateMap<VrstaTroska, VrstaTroskaDTOInsertUpdate>();

            // RadniNalog mappings
            CreateMap<RadniNalog, RadniNalogDTORead>()
                .ForCtorParam("DjelatnikImeIPrezime",
                    opt => opt.MapFrom(src => src.Djelatnik.Ime + " " + src.Djelatnik.Prezime))
                .ForCtorParam("KlijentNaziv",
                    opt => opt.MapFrom(src => src.Klijent.Naziv))
                .ForCtorParam("UkupniTroskovi",
                    opt => opt.MapFrom(src => src.Troskovi.Sum(t => t.Kolicina * t.Cijena)))
                .ForCtorParam("UkupnoPoslovi",
                    opt => opt.MapFrom(src => src.Poslovi.Sum(p => p.Vrijednost)));
            
            CreateMap<RadniNalogDTOInsertUpdate, RadniNalog>();

            // Posao mappings
            CreateMap<Posao, PosaoDTORead>();

            // Mapiranje troškova
            CreateMap<Trosak, TrosakDTORead>()
                // Mapiranje naziva vrste troška
                .ForCtorParam("VrstaNaziv",
                    opt => opt.MapFrom(src => src.VrstaNavigation != null ? src.VrstaNavigation.Naziv : ""))
                // Izračun ukupne cijene troška (količina * cijena)
                .ForCtorParam("Ukupno",
                    opt => opt.MapFrom(src => src.Kolicina * src.Cijena));
            
            // Mapiranje za dodavanje i ažuriranje troška
            CreateMap<TrosakDTOInsertUpdate, Trosak>();
            CreateMap<Trosak, TrosakDTOInsertUpdate>();
        }
    }
}
