using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Backend.Mapping
{
    public class RadniNaloziMappingProfile : Profile
    {
        private readonly IServiceProvider _serviceProvider;
        
        public RadniNaloziMappingProfile(IServiceProvider serviceProvider = null)
        {
            _serviceProvider = serviceProvider;
            
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
                .ForCtorParam("Djelatnici",
                    opt => opt.MapFrom(src => src.Djelatnici.Select(d => new DjelatnikInfo(d.Sifra, d.Ime + " " + d.Prezime)).ToList()))
                .ForCtorParam("KlijentNaziv",
                    opt => opt.MapFrom(src => src.Klijent.Naziv))
                .ForCtorParam("VrijednostRadnihSati",
                    opt => opt.MapFrom(src => IzracunajVrijednostRadnihSati(src)))
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
            CreateMap<TrosakDTOInsertUpdate, Trosak>()
                .ForMember(dest => dest.Vrsta, opt => opt.MapFrom(src => src.Vrsta))
                .ForMember(dest => dest.RadniNalog, opt => opt.MapFrom(src => src.RadniNalog));
            
            CreateMap<Trosak, TrosakDTOInsertUpdate>()
                .ForMember(dest => dest.Vrsta, opt => opt.MapFrom(src => src.Vrsta))
                .ForMember(dest => dest.RadniNalog, opt => opt.MapFrom(src => src.RadniNalog));
        }
        
        private decimal IzracunajVrijednostRadnihSati(RadniNalog radniNalog)
        {
            if (radniNalog.VrijemePocetka == null || radniNalog.RadnihSati == null || radniNalog.RadnihSati == 0 || !radniNalog.Djelatnici.Any())
                return 0;
            
            var vrijemePocetka = radniNalog.VrijemePocetka.Value;
            var godina = vrijemePocetka.Year;
            var mjesec = vrijemePocetka.Month.ToString("00");
            
            // Get the RadniSatiPoMjesecu for the specific month and year
            RadniSatiPoMjesecu radniSatiUMjesecu = null;
            
            if (_serviceProvider != null)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<RadniNaloziContext>();
                    radniSatiUMjesecu = dbContext.RadniSatiPoMjesecu
                        .FirstOrDefault(rs => rs.Godina == godina && rs.Mjesec == mjesec);
                }
            }
            
            if (radniSatiUMjesecu == null || radniSatiUMjesecu.Sati == 0)
                return 0;
            
            // Calculate the average value of one working hour for all djelatnici
            var prosjecnaBrutto2Placa = radniNalog.Djelatnici.Average(d => d.Brutto2Placa);
            var vrijednostJednogRadnogSata = prosjecnaBrutto2Placa / radniSatiUMjesecu.Sati;
            
            // Calculate the total value of working hours
            return radniNalog.RadnihSati.Value * vrijednostJednogRadnogSata;
        }
    }
}
