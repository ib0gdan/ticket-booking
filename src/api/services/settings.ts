import instance from '@/api/clients/axios.client';

export const settingsApi = {
  getSettings: (): Promise<{ bookingPaymentTimeSeconds: number }> =>
    instance.get('/settings').then((res) => res.data),
};
