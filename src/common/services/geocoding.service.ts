import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getCoordinates(address: string, city: string, province: string, state: string, zipCode: string) {
    
    // 1. LIMPIEZA DINÁMICA: Eliminamos prefijos que confunden a Nominatim
    // Esto quita "Calle de ", "Calle ", "C/ ", etc., al principio de la cadena
    const cleanAddress = address
      .replace(/^(calle de|calle|c\/|c.|avenida|avda|av.|pasaje|psj.)\s+/i, '')
      .trim();

    // 2. Construimos la query con la dirección limpia
    const query = `${cleanAddress}, ${zipCode}, ${city}, ${province}, ${state}, España`;
    
    const url = 'https://nominatim.openstreetmap.org/search';
    const stage = this.configService.get('STATE') || 'dev'; 

    try {
      if (stage !== 'prod') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Añadimos configuración de timeout para evitar que la app se quede colgada si la API externa no responde
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          params: { q: query, format: 'json', limit: 1 },
          timeout: 5000, // <--- MODIFICACIÓN CRÍTICA: Corta la conexión si tarda más de 5 segundos
          headers: { 
            'User-Agent': `Kanadopta-App-Geocoding-${Math.random().toString(36).substring(7)}` 
          },
        }),
      );

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }

      // Si Nominatim responde pero devuelve un array vacío, significa que la dirección no existe para ellos
      this.logger.warn(`[WARN] No se pudo localizar la dirección: ${query}`);
      return null;

    } catch (error: any) {
      // Manejo específico si el error fue por culpa del timeout de 5 segundos
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        this.logger.error(`[TIMEOUT] La API de Nominatim ha tardado más de 5 segundos en responder para: ${query}`);
      } else {
        this.logger.error(`[ERROR] Error en Geocoding: ${error.message || error}`);
      }
      
      // Retornamos null con total seguridad para que el servicio de centros lo gestione sin romper la app
      return null;
    }
  }
}