import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Book, BookOpen, Brain, Heart, Smile, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const benefitIcons = {
  "Emotional Intelligence": Heart,
  "Problem Solving": Brain,
  "Social Skills": Smile,
  "Character Building": Star,
  "Language Development": Book,
};

export function BookSidebar() {
  const { data: benefits = [], isLoading } = useQuery({
    queryKey: ['benefits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('benefits')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Benefits</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <BookOpen />
                    <span>All Books</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </SidebarMenuItem>
                ))
              ) : (
                benefits.map((benefit) => {
                  const IconComponent = benefitIcons[benefit.name] || Book;
                  return (
                    <SidebarMenuItem key={benefit.id}>
                      <SidebarMenuButton asChild>
                        <Link to={`/benefit/${benefit.name}`}>
                          <IconComponent />
                          <span>{benefit.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}