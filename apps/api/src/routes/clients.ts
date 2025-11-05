import express from 'express';
import { getAllClients, getClientById, createClient, updateClient, deleteClient } from '@repo/database/schema';
import type { Client } from '@repo/types';

export const clientsRouter = express.Router();

// GET all clients
clientsRouter.get('/', async (req, res) => {
  try {
    const clients = await getAllClients();
    res.json({ data: clients });
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// GET client by ID
clientsRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }

    const client = await getClientById(id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ data: client });
  } catch (error) {
    console.error('Failed to fetch client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// POST create client
clientsRouter.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, company } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'> = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
      company: company || undefined,
    };

    const newClient = await createClient(clientData);
    res.status(201).json({ data: newClient });
  } catch (error) {
    console.error('Failed to create client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// PATCH update client
clientsRouter.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }

    const updatedClient = await updateClient(id, req.body);
    res.json({ data: updatedClient });
  } catch (error) {
    console.error('Failed to update client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE client
clientsRouter.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }

    await deleteClient(id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Failed to delete client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});
