import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import type { Client } from '@/types';

export function useClients() {
  const queryClient = useQueryClient();

  // Fetch all clients
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const result = await invoke<Client[]>('get_all_clients');
      return result;
    },
  });

  // Add client mutation
  const addClient = useMutation({
    mutationFn: async (client: Omit<Client, 'id' | 'created_at'>) => {
      const id = await invoke<number>('add_client', { client });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  // Update client mutation
  const updateClient = useMutation({
    mutationFn: async ({ id, client }: { id: number; client: Omit<Client, 'id' | 'created_at'> }) => {
      await invoke('update_client', { id, client });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  // Delete client mutation
  const deleteClient = useMutation({
    mutationFn: async (id: number) => {
      await invoke('delete_client', { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
  };
}
