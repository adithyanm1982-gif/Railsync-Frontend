import { useMutation } from '@tanstack/react-query';
import { emergencyApi, EmergencyRequestPayload } from '../api/emergencyApi';

export function useEvaluateEmergency() {
  return useMutation({
    mutationFn: (payload: EmergencyRequestPayload) => emergencyApi.evaluate(payload),
  });
}
