import { HttpService } from "./HttpService";


async function get(){
    return await HttpService.get('/VrstaTroska')
    .then((odgovor)=>{
        //console.table(odgovor.data)
        return odgovor.data;
    })
    .catch((e)=>{})
}

async function getBySifra(sifra){
    return await HttpService.get('/VrstaTroska/' + sifra)
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{})
}


async function dodaj(vrstaTroska){
    return HttpService.post('/vrstatroska',vrstaTroska)
    .then(()=>{return {greska: false, poruka: 'Dodano'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod dodavanja'}})
}

async function promjena(sifra,vrstaTroska){
    return HttpService.put('/vrstatroska/'+sifra,vrstaTroska)
    .then(()=>{return {greska: false, poruka: 'Promjenjeno'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod promjene'}})
}

async function obrisi(sifra){
    return HttpService.delete('/vrstatroska/'+sifra)
    .then(()=>{return {greska: false, poruka: 'Obrisano'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod brisanja'}})
}



export default{
    get,
    getBySifra,
    dodaj,
    promjena,
    obrisi
}
