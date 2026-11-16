import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, UserX } from 'lucide-react';

export default function AdminUsers() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date'),
    initialData: [],
  });

  const getRoleBadge = (role) => {
    if (role === 'admin') return <Badge variant="destructive">Admin</Badge>;
    return <Badge variant="secondary">{role}</Badge>;
  };

  const getUserTypeBadge = (userType) => {
    if (userType === 'artist') return <Badge className="bg-purple-100 text-purple-800">Artista</Badge>;
    if (userType === 'fan') return <Badge className="bg-pink-100 text-pink-800">Fan</Badge>;
    return <Badge variant="outline">{userType || 'No definido'}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600" />
            Gestionar Usuarios
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Usuarios</CardTitle>
          <CardDescription>
            Lista de todos los usuarios registrados en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-10">Error al cargar los usuarios.</p>
          ) : users.length === 0 ? (
            <div className="text-center py-16">
              <UserX className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No hay usuarios registrados.</h3>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Tipo de Usuario</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || 'No disponible'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getUserTypeBadge(user.user_type)}</TableCell>
                    <TableCell>{new Date(user.created_date).toLocaleDateString('es-AR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}