"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, UserPlus, Trash2, Mail, Users, ShieldAlert, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const AVAILABLE_PERMISSIONS = [
  { id: "products", label: "Manage Products" },
  { id: "orders", label: "Manage Orders" },
  { id: "users", label: "Manage Users" },
  { id: "vendors", label: "Manage Vendors" },
  { id: "revenue", label: "View Revenue" },
  { id: "employee", label: "Manage Employees" }
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { 
    if (token && (user?.role === "admin" || user?.permissions?.includes("employee"))) {
      fetchEmployees(); 
    }
  }, [token, user]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/employees`, { headers: { Authorization: `Bearer ${token}` } });
      setEmployees(res.data);
    } catch (err) { 
      console.error(err); 
      toast.error("Failed to fetch employees");
    } finally { 
      setLoading(false); 
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/employees`, {
        ...formData,
        permissions: selectedPermissions
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      toast.success("Employee Added");
      setFormData({ name: "", email: "", password: "" });
      setSelectedPermissions([]);
      setIsDialogOpen(false);
      fetchEmployees();
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to add employee"); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this employee? This action cannot be undone.")) return;
    try {
        await axios.delete(`${API_URL}/employees/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Employee removed");
        fetchEmployees();
    } catch (err) { toast.error("Delete failed"); }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleEditClick = (employee: any) => {
    setFormData({ name: employee.name, email: employee.email, password: "" });
    setSelectedPermissions(employee.permissions || []);
    setEditingId(employee._id);
    setIsDialogOpen(true);
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/employees/${editingId}`, {
        permissions: selectedPermissions
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      toast.success("Permissions Updated");
      setEditingId(null);
      setFormData({ name: "", email: "", password: "" });
      setSelectedPermissions([]);
      setIsDialogOpen(false);
      fetchEmployees();
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Update failed"); 
    }
  };

  // Prevent non-admins/unauthorized from viewing this page
  if (user && user.role !== "admin" && !user.permissions?.includes("employee")) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex flex-col items-center justify-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-zinc-500 mt-2 text-center max-w-md">You do not have permission to view the employee management area.</p>
        <Link href="/admin/dashboard" className="mt-6 text-primary hover:underline font-medium">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50/50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link className="flex items-center gap-2 mt-2 text-zinc-400 hover:text-black mb-8 transition-colors font-bold uppercase text-xs tracking-widest" href={"/admin/dashboard"}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold text-zinc-900">Manage Employees</h1>
            <p className="text-zinc-500 mt-2">Add staff members and assign specific dashboard access.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white rounded-full px-6 h-12 shadow-lg">
                <UserPlus className="w-4 h-4 mr-2" /> Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl p-8 max-w-md">
              <DialogHeader><DialogTitle className="font-serif text-2xl mb-4">{editingId ? "Edit Permissions" : "Add New Employee"}</DialogTitle></DialogHeader>
              <form onSubmit={editingId ? handleUpdateEmployee : handleAddEmployee} className="space-y-4">
                {!editingId && (
                  <div className="space-y-2">
                    <Input required placeholder="Employee Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-xl h-12 bg-zinc-50 border-0" />
                    <Input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="rounded-xl h-12 bg-zinc-50 border-0" />
                    <Input required type="password" placeholder="Temporary Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="rounded-xl h-12 bg-zinc-50 border-0" />
                  </div>
                )}
                
                {editingId && (
                  <div className="bg-zinc-50 p-4 rounded-xl mb-4 border border-zinc-100">
                    <p className="text-sm font-bold text-zinc-900">{formData.name}</p>
                    <p className="text-xs text-zinc-500">{formData.email}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-zinc-100">
                  <h3 className="font-bold text-sm mb-3 text-zinc-700">Access Permissions</h3>
                  <div className="space-y-3">
                    {AVAILABLE_PERMISSIONS.map(permission => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`perm-${permission.id}`} 
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <Label htmlFor={`perm-${permission.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl bg-black text-white font-bold mt-6">
                  {editingId ? "Save Changes" : "Create Employee Account"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? <div className="col-span-full py-10 text-center"><p className="text-zinc-400">Loading employees...</p></div> : employees.length === 0 ? <div className="col-span-full py-10 text-center bg-white rounded-2xl border border-dashed border-zinc-200"><p className="text-zinc-400">No employees added yet.</p></div> : (
                employees.map((employee) => (
                    <div key={employee._id} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-zinc-50 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(employee)} className="text-zinc-300 hover:text-black">
                                    <ShieldCheck className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(employee._id)} className="text-zinc-300 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <h3 className="font-serif text-xl font-bold mb-1">{employee.name}</h3>
                        <div className="space-y-2 text-sm text-zinc-500 pb-4 mb-4 flex-grow">
                            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-zinc-400" /> {employee.email}</p>
                        </div>
                        
                        <div className="border-t border-zinc-50 pt-4 mt-auto">
                           <div className="flex items-center gap-2 mb-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                               <ShieldCheck className="w-3 h-3" /> Permissions
                           </div>
                           <div className="flex flex-wrap gap-2">
                               {employee.permissions && employee.permissions.length > 0 ? (
                                   employee.permissions.map((perm: string) => {
                                       const label = AVAILABLE_PERMISSIONS.find(p => p.id === perm)?.label || perm;
                                       return (
                                           <span key={perm} className="text-xs bg-zinc-100 text-zinc-700 font-medium px-2 py-1 rounded-md">
                                               {label}
                                           </span>
                                       )
                                   })
                               ) : (
                                   <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-md font-medium">No permissions</span>
                               )}
                           </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
