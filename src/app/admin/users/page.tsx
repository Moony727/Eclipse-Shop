"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types";
import {
  UserIcon,
  RefreshCw,
  Shield,
  ShieldOff,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";

export default function UsersPage() {
  const { firebaseUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (!firebaseUser) return;
    setIsLoading(true);
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const usersData: User[] = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as User[];
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch {
      toast.error("An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleToggleAdmin = async (userId: string, currentAdmin: boolean) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isAdmin: !currentAdmin,
      });
      toast.success(`User admin status updated`);
      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, isAdmin: !currentAdmin } : u));
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and admin permissions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="relative">
        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-10 h-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card overflow-hidden flex flex-col h-[600px]">
        <div className="overflow-y-auto flex-1">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50 z-10">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Admin Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Loading users...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">ID: {user.uid.slice(0, 8)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isAdmin ? "secondary" : "outline"} className="text-[10px]">
                        {user.isAdmin ? "Admin" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {user.createdAt.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleToggleAdmin(user.uid, user.isAdmin || false)}
                          title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                        >
                          {user.isAdmin ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
