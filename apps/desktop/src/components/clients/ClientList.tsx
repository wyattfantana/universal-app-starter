import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import ClientForm from './ClientForm';
import type { Client } from '@repo/types';

export default function ClientList() {
  const { clients, isLoading, addClient, updateClient, deleteClient } = useClients();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter clients based on search
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingClient(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete client');
      }
    }
  };

  const handleSubmit = async (clientData: Omit<Client, 'id' | 'created_at'>) => {
    try {
      if (editingClient) {
        await updateClient.mutateAsync({ id: editingClient.id!, client: clientData });
      } else {
        await addClient.mutateAsync(clientData);
      }
      setIsFormOpen(false);
      setEditingClient(undefined);
    } catch (error) {
      alert('Failed to save client');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading clients...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          + Add Client
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input max-w-md"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'No clients found matching your search' : 'No clients yet. Add your first client!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{client.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{client.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{client.company || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-brand-600 hover:text-brand-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <ClientForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingClient(undefined);
        }}
        onSubmit={handleSubmit}
        client={editingClient}
        isLoading={addClient.isPending || updateClient.isPending}
      />
    </div>
  );
}
