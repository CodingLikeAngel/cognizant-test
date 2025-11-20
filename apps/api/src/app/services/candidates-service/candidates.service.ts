// // candidates.service.ts

// import { Injectable, BadRequestException } from '@nestjs/common';
// import * as XLSX from 'xlsx';
// import { Express } from 'express';
// import { Multer } from 'multer';


// @Injectable()
// export class CandidatesService {
 
//   processExcel(file: Express.Multer.File, name: string, surname: string): any {
//     if (!file || !file.buffer) {
//       throw new BadRequestException('No se ha enviado un archivo Excel válido.');
//     }

//     const workbook = XLSX.read(file.buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     const rows = XLSX.utils.sheet_to_json(worksheet);
//     if (rows.length !== 1) {
//       throw new BadRequestException(
//         'El archivo Excel debe contener exactamente 1 fila de datos (además del encabezado).'
//       );
//     }

//     const rawData = rows[0] as Record<string, any>;
//     const normalizedData: Record<string, any> = {};

//     Object.keys(rawData).forEach(originalKey => {
//       // ... (normalización de claves)
//       const normalizedKey = originalKey
//         .toLowerCase()
//         .normalize('NFD')
//         .replace(/[\u0300-\u036f]/g, '')
//         .replace(/\s+/g, '');

//       normalizedData[normalizedKey] = rawData[originalKey];
//     });

//     const requiredColumns = {
//       seniority: 'seniority',
//       yearsOfExperience: 'yearsofexperience',
//       availability: 'availability',
//     };

//     Object.values(requiredColumns).forEach(col => {
//       if (!(col in normalizedData)) {
//         throw new BadRequestException(
//           `Falta la columna requerida en el Excel: ${col}`
//         );
//       }
//     });

//     //  Convertir y Validar Seniority
//     const seniorityRaw = normalizedData['seniority']; 
    
//     if (typeof seniorityRaw === 'number') {
//       throw new BadRequestException(
//         `El valor de Seniority es un número (${seniorityRaw}). Se esperaba un texto: "junior" o "senior".`
//       );
//     }
    
//     const seniority = (seniorityRaw ? seniorityRaw.toString() : '').trim(); 
//     const yearsOfExperience = Number(normalizedData['yearsofexperience']);

//     const availabilityRaw = normalizedData['availability'];
//     const availability =
//       availabilityRaw === true ||
//       availabilityRaw === 1 ||
//       availabilityRaw?.toString().toLowerCase() === 'true' ||
//       availabilityRaw?.toString().toLowerCase() === 'yes' ||
//       availabilityRaw?.toString().toLowerCase() === 'si';

//     // Validación de Seniority estricta
//     const validSeniorityValues = ['junior', 'senior'];
//     const seniorityLower = seniority.toLowerCase(); 

//     if (!validSeniorityValues.includes(seniorityLower)) {
//       throw new BadRequestException(
//         `El valor de Seniority ('${seniority}') no es válido. Debe ser "junior" o "senior".`
//       );
//     }

//     //  Retornar formato limpio
//     return {
//       name: name, 
//       surname: surname,
//       seniority: seniorityLower,
//       yearsOfExperience,
//       availability,
//     };
//   }
// }


// candidates.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { Express } from 'express';
import { Multer } from 'multer'; // ✅ esto ya no da error





@Injectable()
export class CandidatesService {
  async processExcel(
    file: Express.Multer.File,
    name: string,
    surname: string,
  ): Promise<any> {
    if (!file?.buffer) {
      throw new BadRequestException('No se ha enviado un archivo Excel válido.');
    }

    const workbook = new ExcelJS.Workbook();


  // @ts-ignore: ExcelJS no soporta aún Buffer<ArrayBufferLike> de Multer/Node 20+
await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new BadRequestException('El archivo Excel no tiene hojas.');
    }

    // === ENCABEZADOS ===
    const headerRow = worksheet.getRow(1);
    const headers: string[] = [];

    headerRow.eachCell({ includeEmpty: false }, (cell) => {
      const header = (cell.text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');
      headers.push(header);
    });

    if (worksheet.rowCount < 2) {
      throw new BadRequestException('El Excel debe tener al menos una fila de datos.');
    }

    // === FILA DE DATOS (fila 2) ===
    const dataRow = worksheet.getRow(2);
    const rawData: Record<string, any> = {};

    dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const key = headers[colNumber - 1];
      if (key) rawData[key] = cell.value;
    });

    // === COLUMNAS REQUERIDAS ===
    const required = ['seniority', 'yearsofexperience', 'availability'] as const;
    for (const col of required) {
      if (rawData[col] === undefined || rawData[col] === null) {
        throw new BadRequestException(`Falta la columna: ${col}`);
      }
    }

    // === SENIORITY ===
    const seniorityStr = String(rawData.seniority || '').trim().toLowerCase();
    const seniority = /senior|sr|sénior/.test(seniorityStr) ? 'senior' : 'junior';

    // === AÑOS DE EXPERIENCIA ===
    const years = Number(rawData.yearsofexperience);
    if (isNaN(years) || years < 0) {
      throw new BadRequestException('Años de experiencia debe ser un número válido ≥ 0');
    }

    // === DISPONIBILIDAD ===
    const availStr = String(rawData.availability || '').toLowerCase().trim();
    const availability = ['true', 'yes', 'sí', 'si', '1', 'disponible'].some(v => availStr.includes(v));

    return {
      name: name.trim(),
      surname: surname.trim(),
      seniority,
      yearsOfExperience: years,
      availability,
    };
  }
}