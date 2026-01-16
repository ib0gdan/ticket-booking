import instance from '@/api/clients/axios.client';

export class SettingsService {
  static async getSettings(): Promise<{ bookingPaymentTimeSeconds: number }> {
    const response = await instance.get('/settings');
    return response.data;
  }
}
