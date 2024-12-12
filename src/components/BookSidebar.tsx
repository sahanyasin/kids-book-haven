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
import { benefits } from "@/data/books";
import { Book, BookOpen, Brain, Heart, Smile, Star } from "lucide-react";

const benefitIcons = {
  "Emotional Intelligence": Heart,
  "Problem Solving": Brain,
  "Social Skills": Smile,
  "Character Building": Star,
  "Language Development": Book,
};

export function BookSidebar() {
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
              {benefits.map((benefit) => {
                const IconComponent = benefitIcons[benefit] || Book;
                return (
                  <SidebarMenuItem key={benefit}>
                    <SidebarMenuButton asChild>
                      <Link to={`/benefit/${benefit}`}>
                        <IconComponent />
                        <span>{benefit}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}