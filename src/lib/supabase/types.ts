export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      calorie_entries: {
        Row: {
          id: string
          user_id: string
          name: string
          calories: number
          mealType: string
          timestamp: string
          emoji?: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          calories: number
          mealType: string
          timestamp?: string
          emoji?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          calories?: number
          mealType?: string
          timestamp?: string
          emoji?: string | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          daily_goal: number
          weight_unit: string
          height_unit: string
          activity_level: string
          goal_type: string
          weight_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          daily_goal?: number
          weight_unit?: string
          height_unit?: string
          activity_level?: string
          goal_type?: string
          weight_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          daily_goal?: number
          weight_unit?: string
          height_unit?: string
          activity_level?: string
          goal_type?: string
          weight_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
