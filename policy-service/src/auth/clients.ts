// src/auth/clients.ts

export interface Client {
    id: string;
    secret: string;
}

const clients: Client[] = [
    { id: "generic-client", secret: "not_available" },
    { id: "generic-admin", secret: "not_available" }
];

/**
 * Retrieves a client by ID.
 * @param id The ID of the client to retrieve.
 * @returns A Promise that resolves to the client or null if not found.
 */
export function getClient(id: string): Promise<Client | null> {
    const client = clients.find(client => client.id === id);
    return Promise.resolve(client || null);
}

