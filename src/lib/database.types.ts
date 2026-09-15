export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string;
          name: string;
          maker: string;
          category: string;
          price_per_day: number;
          seats: number;
          bags: number;
          transmission: string;
          top_speed_mph: number;
          zero_to_sixty: number;
          rating: number;
          reviews: number;
          fuel: string;
          color_from: string;
          color_to: string;
          featured: boolean;
          description: string;
          features: string[];
          location: string;
          fuel_economy: string;
        };
        Insert: Partial<Database["public"]["Tables"]["cars"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["cars"]["Row"]>;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          car_id: string;
          pickup_location: string;
          dropoff_location: string;
          pickup_date: string;
          dropoff_date: string;
          extras: string[];
          driver_name: string;
          driver_email: string;
          total_price: number;
          status: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bookings"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["bookings"]["Row"],
            | "id"
            | "user_id"
            | "car_id"
            | "pickup_location"
            | "dropoff_location"
            | "pickup_date"
            | "dropoff_date"
            | "driver_name"
            | "driver_email"
            | "total_price"
          >;
        Update: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          created_at: string;
          is_admin: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      unavailable_car_ids: {
        Args: { p_pickup: string; p_dropoff: string };
        Returns: string[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
