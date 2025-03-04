import { KlijentDTO } from "../models/KlijentDTO";
import { HttpService } from "./HttpService";

export async function getKlijenti() {
    return await HttpService.get("klijent");
}

export async function getKlijentBySifra(sifra: number) {
    return await HttpService.get(`klijent/${sifra}`);
}

export async function postKlijent(klijent: KlijentDTO) {
    return await HttpService.post("klijent", klijent);
}

export async function putKlijent(sifra: number, klijent: KlijentDTO) {
    return await HttpService.put(`klijent/${sifra}`, klijent);
}

export async function deleteKlijent(sifra: number) {
    return await HttpService.delete(`klijent/${sifra}`);
}
