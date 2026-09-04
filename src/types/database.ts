export type UserRole = "super_admin" | "admin" | "editor";
export type ProjectStatus = "draft" | "in_progress" | "completed" | "concept";
export type ImageKind =
  | "gallery"
  | "blueprint"
  | "floor_plan"
  | "construction"
  | "before"
  | "after";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  location: string | null;
  client: string | null;
  architect: string | null;
  year: number | null;
  area: string | null;
  status: ProjectStatus;
  featured: boolean;
  published: boolean;
  cover_image: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  kind: ImageKind;
  display_order: number;
  created_at: string;
}

export interface ProjectVideo {
  id: string;
  project_id: string;
  video_url: string;
  thumbnail: string | null;
  title: string | null;
  display_order: number;
  created_at: string;
}

export interface ProjectWithMedia extends Project {
  project_images: ProjectImage[];
  project_videos: ProjectVideo[];
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  display_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  image: string | null;
  quote: string;
  published: boolean;
  display_order: number;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  photo: string | null;
  bio: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  logo_url: string;
  display_order: number;
  created_at: string;
}

export interface Settings {
  id: 1;
  company_name: string;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  social_linkedin: string | null;
  social_youtube: string | null;
  social_tiktok: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_og_image: string | null;
  stats_years_experience: number | null;
  stats_awards: number | null;
  updated_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  project_type: string | null;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: Partial<Project> & { title: string; slug: string };
        Update: Partial<Project>;
        Relationships: [];
      };
      project_images: {
        Row: ProjectImage;
        Insert: Partial<ProjectImage> & { project_id: string; image_url: string };
        Update: Partial<ProjectImage>;
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      project_videos: {
        Row: ProjectVideo;
        Insert: Partial<ProjectVideo> & { project_id: string; video_url: string };
        Update: Partial<ProjectVideo>;
        Relationships: [
          {
            foreignKeyName: "project_videos_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      services: {
        Row: Service;
        Insert: Partial<Service> & { title: string };
        Update: Partial<Service>;
        Relationships: [];
      };
      testimonials: {
        Row: Testimonial;
        Insert: Partial<Testimonial> & { client_name: string; quote: string };
        Update: Partial<Testimonial>;
        Relationships: [];
      };
      blogs: {
        Row: Blog;
        Insert: Partial<Blog> & { title: string; slug: string };
        Update: Partial<Blog>;
        Relationships: [];
      };
      team: {
        Row: TeamMember;
        Insert: Partial<TeamMember> & { name: string };
        Update: Partial<TeamMember>;
        Relationships: [];
      };
      client_logos: {
        Row: ClientLogo;
        Insert: Partial<ClientLogo> & { name: string; logo_url: string };
        Update: Partial<ClientLogo>;
        Relationships: [];
      };
      settings: {
        Row: Settings;
        Insert: Partial<Settings>;
        Update: Partial<Settings>;
        Relationships: [];
      };
      contacts: {
        Row: Contact;
        Insert: Partial<Contact> & { name: string; email: string; message: string };
        Update: Partial<Contact>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      project_status: ProjectStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
