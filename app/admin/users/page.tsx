"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Mail, Calendar, ArrowLeft } from "lucide-react";
import axios from "axios";
import Link from "next/link";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = res.data;

        const filteredUsers = data.filter(
          (user: any) => user.email !== "rajb81008@gmail.com"
        );

        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-16 px-8 bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <Link
            className="flex items-center gap-2 mt-2 text-zinc-400 hover:text-black mb-8 transition-colors font-bold uppercase text-[20px] tracking-widest" href={"/admin/dashboard"}        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="font-serif text-4xl font-bold mb-8 flex items-center gap-3">
          <User className="w-10 h-10" /> Registered Users
        </h1>

        <div className="bg-card rounded-2xl shadow-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Mobile</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: any) => (
                  <TableRow
                    key={user._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {user._id}
                    </TableCell>

                    <TableCell className="font-semibold">
                      {user.name}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                        {user.phone}
                      </span>
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
