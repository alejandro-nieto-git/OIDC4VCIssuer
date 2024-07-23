/**
 * Represents a Titulacion Digital UVa.
 */
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

    /**
     * Initializes a Titulacion object.
     * 
     * @param codigoTitulacion The code of the titulacion.
     * @param tipo The type of the titulacion.
     * @param nombreTitulacion The name of the titulacion.
     * @param promocion The promotion of the titulacion.
     * @param notaMedia The average grade of the titulacion.
     * @param fechaHoraEmision The date and time of the titulacion.
     * @param revocada If the titulacion has been revoked.
     * @param decretoLey The law decree of the titulacion.
     * @param descripcionRegistroFisico The physical registration description of the titulacion.
     */
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

/**
 * Represents the types of Titulacion.
 */
export enum TipoTitulacion {
    GRADO = "Grado",
    MASTER = "Master"
}
