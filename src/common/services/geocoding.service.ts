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

  async getCoordinates(address: string, city: string, zipCode: string) {
    // Usamos la dirección tal cual nos llega, sin manipulaciones ni limpiezas arriesgadas
    const query = `${address}, ${zipCode}, ${city}, España`;
    const url = 'https://nominatim.openstreetmap.org/search';
    const stage = this.configService.get('STATE') || 'dev'; 

    try {
      if (stage !== 'prod') {
        // Pausa de seguridad para no saturar la API en entornos de desarrollo
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          params: { q: query, format: 'json', limit: 1 },
          headers: { 
            'User-Agent': `Kanadopta-App-Julio-${Math.random().toString(36).substring(7)}` 
          },
        }),
      );

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }

      this.logger.warn(`[WARN] No se pudo localizar la dirección: ${query}`);
      return null;
    } catch (error) {
      this.logger.error(`[ERROR] Error en Geocoding: ${error.message}`);
      return null;
    }
  }
}