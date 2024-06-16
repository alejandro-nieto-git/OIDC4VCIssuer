export class Titulacion {
    private codigoTitulacion: string;
    private tipo: TipoTitulacion;
    private nombreTitulacion: string;
    private promocion: string;
    private notaMedia: string;
    private fechaHoraEmision: string;
    private revocada: boolean;
    private decretoLey: string;
    private descripcionRegistroFisico: string;

    constructor(codigoTitulacion: string, tipo: TipoTitulacion, nombreTitulacion: string, promocion: string, notaMedia: string, fechaHoraEmision: string, revocada: boolean, decretoLey: string, descripcionRegistroFisico: string) {
        this.codigoTitulacion = codigoTitulacion;
        this.tipo = tipo;
        this.nombreTitulacion = nombreTitulacion;
        this.promocion = promocion;
        this.notaMedia = notaMedia;
        this.fechaHoraEmision = fechaHoraEmision;
        this.revocada = revocada;
        this.decretoLey = decretoLey;
        this.descripcionRegistroFisico = descripcionRegistroFisico;
    }
}

export enum TipoTitulacion {
    GRADO = "Grado",
    MASTER = "Master"
}
