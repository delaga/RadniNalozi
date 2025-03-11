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
    return HttpService.post('/radniNalog',radniNalog)
    .then(()=>{return {greska: false, poruka: 'Dodano'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod dodavanja'}})
}

async function promjena(sifra,radniNalog){
    return HttpService.put('/radniNalog/'+sifra,radniNalog)
    .then(()=>{return {greska: false, poruka: 'Promjenjeno'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod promjene'}})
}

async function obrisi(sifra){
    return HttpService.delete('/radniNalog/'+sifra)
    .then(()=>{return {greska: false, poruka: 'Obrisano'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod brisanja'}})
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
    return HttpService.post(`/RadniNalog/${radniNalogSifra}/poslovi/${posaoSifra}`, { kolicina })
    .then((odgovor) => {
        return odgovor.data;
    })
    .catch((e) => {
        console.error("Greška kod dodavanja posla:", e);
        return { greska: true, poruka: 'Problem kod dodavanja posla' };
    });
}

async function dodajTrosak(radniNalogSifra, trosakSifra, kolicina = 1) {
    return HttpService.post(`/RadniNalog/${radniNalogSifra}/troskovi/${trosakSifra}`, { kolicina })
    .then((odgovor) => {
        return odgovor.data;
    })
    .catch((e) => {
        console.error("Greška kod dodavanja troška:", e);
        return { greska: true, poruka: 'Problem kod dodavanja troška' };
    });
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
