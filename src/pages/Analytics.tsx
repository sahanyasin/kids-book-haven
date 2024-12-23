import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Analytics = () => {
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

  // Fetch activity data
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['userActivity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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

  // Process data for charts
  const activityByType = activityData?.reduce((acc: any, curr: any) => {
    acc[curr.action_type] = (acc[curr.action_type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(activityByType || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="container py-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        ← Back
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="value" fill="#9b87f5" />
                    <ChartTooltip>
                      <ChartTooltipContent />
                    </ChartTooltip>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityData?.slice(0, 10).map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action_type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                  {activity.details && (
                    <pre className="text-sm bg-gray-50 p-2 rounded">
                      {JSON.stringify(activity.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;