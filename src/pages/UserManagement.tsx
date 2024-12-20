import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UserManagement = () => {
  const navigate = useNavigate();

  // Check if user is admin
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single();
      
      return !!adminUser;
    }
  });

  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      return users;
    },
    enabled: !!isAdmin
  });

  // Redirect non-admin users
  if (!isCheckingAdmin && !isAdmin) {
    navigate('/');
    return null;
  }

  if (isLoading || isCheckingAdmin) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users?.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-500">ID: {user.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm px-2 py-1 rounded-full bg-gray-100">
                    {user.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;