import { HttpService } from "./HttpService";


async function get(){
    return await HttpService.get('/RadniNalog')
    .then((odgovor)=>{
        //console.table(odgovor.data)
        return odgovor.data;
    })
    .catch((e)=>{})
}

async function getBySifra(sifra){
    return await HttpService.get('/RadniNalog/' + sifra)
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{})
}


async function dodaj(radniNalog){
    return HttpService.post('/RadniNalog',radniNalog)
    .then(()=>{return {greska: false, poruka: 'Dodano'}})
    .catch((e)=>{
        console.error("Greška kod dodavanja radnog naloga:", e);
        return {greska: true, poruka:'Problem kod dodavanja'}
    })
}

async function promjena(sifra,radniNalog){
    return HttpService.put('/RadniNalog/'+sifra,radniNalog)
    .then(()=>{return {greska: false, poruka: 'Promjenjeno'}})
    .catch((e)=>{
        console.error("Greška kod promjene radnog naloga:", e);
        return {greska: true, poruka:'Problem kod promjene'}
    })
}

async function obrisi(sifra){
    return HttpService.delete('/RadniNalog/'+sifra)
    .then(()=>{return {greska: false, poruka: 'Obrisano'}})
    .catch((e)=>{
        console.error("Greška kod brisanja radnog naloga:", e);
        return {greska: true, poruka:'Problem kod brisanja'}
    })
}

// Dohvaća poslove vezane za radni nalog s određenom šifrom
async function getPoslovi(sifra){
    return await HttpService.get('/RadniNalog/' + sifra + '/poslovi')
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{return []}) // U slučaju greške vraća prazno polje
}

// Dohvaća troškove vezane za radni nalog s određenom šifrom
async function getTroskovi(sifra){
    return await HttpService.get('/RadniNalog/' + sifra + '/troskovi')
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{return []}) // U slučaju greške vraća prazno polje
}


async function dodajPosao(radniNalogSifra, posaoSifra, kolicina = 1) {
    try {
        const odgovor = await HttpService.post(`/RadniNalog/${radniNalogSifra}/poslovi/${posaoSifra}`, { kolicina });
        console.log("Uspješno dodan posao:", odgovor.data);
        return odgovor.data;
    } catch (e) {
        console.error("Greška kod dodavanja posla:", e);
        if (e.response) {
            console.error("Detalji greške:", e.response.data);
        }
        return { greska: true, poruka: 'Problem kod dodavanja posla' };
    }
}

async function dodajTrosak(radniNalogSifra, trosakSifra, kolicina = 1) {
    try {
        const odgovor = await HttpService.post(`/RadniNalog/${radniNalogSifra}/troskovi/${trosakSifra}`, { kolicina });
        console.log("Uspješno dodan trošak:", odgovor.data);
        return odgovor.data;
    } catch (e) {
        console.error("Greška kod dodavanja troška:", e);
        if (e.response) {
            console.error("Detalji greške:", e.response.data);
        }
        return { greska: true, poruka: 'Problem kod dodavanja troška' };
    }
}

export default{
    get,
    getBySifra,
    dodaj,
    promjena,
    obrisi,
    getPoslovi,
    getTroskovi,
    dodajPosao,
    dodajTrosak
}
