import { createHash } from 'crypto';

export function fetchTitulacionesFromUVa() {
    //TODO: connect to the uva api
    return [
        {
          'nombreTitulacion': 'Ingenieria Industrial',
          'tipo': 'Grado',
          'codigoTitulacion': '81639',
          'notaMedia': '6',
          'fechaHora': '1709153385',
          'decretoLey': 'a',
          'descripcionRegistroFisico': 'b',
          'fechaHoraEmision': '2021-07-12T12:00:00Z',
          'promocion': '2021',

        },
        {
          'nombreTitulacion': 'Filosofia',
          'tipo': 'Grado',
          'codigoTitulacion': '82639',
          'notaMedia': '5.9',
          'fechaHora': '1709153385',
          'decretoLey': 'a',
          'descripcionRegistroFisico': 'b',
          'fechaHoraEmision': '2021-07-12T12:00:00Z',
          'promocion': '2017',
        },
        {
          'nombreTitulacion': 'Ingenieria Informatica',
          'tipo': 'Grado',
          'codigoTitulacion': '83639',
          'notaMedia': '8.6',
          'fechaHora': '1709153385',
          'decretoLey': 'a',
          'descripcionRegistroFisico': 'b',
          'fechaHoraEmision': '2021-07-12T12:00:00Z',
          'promocion': '2020',
        },
      ]
}

export function hashWithPredefinedSalt(stringObject: any): string{
    const salt = "uva";
    const dataToHash = stringObject + salt;
  
    const hash = createHash('sha256').update(dataToHash).digest();

    return '0x' + hash.toString('hex'); 
}