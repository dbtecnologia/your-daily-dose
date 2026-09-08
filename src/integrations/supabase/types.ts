export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          ano: number
          created_at: string
          email: string | null
          estado: string | null
          fotos: string[]
          id: string
          km: number
          marca: string
          modelo: string
          nome: string
          observacoes: string | null
          placa: string | null
          status: string
          telefone: string
          user_id: string | null
          versao: string | null
        }
        Insert: {
          ano: number
          created_at?: string
          email?: string | null
          estado?: string | null
          fotos?: string[]
          id?: string
          km?: number
          marca: string
          modelo: string
          nome: string
          observacoes?: string | null
          placa?: string | null
          status?: string
          telefone: string
          user_id?: string | null
          versao?: string | null
        }
        Update: {
          ano?: number
          created_at?: string
          email?: string | null
          estado?: string | null
          fotos?: string[]
          id?: string
          km?: number
          marca?: string
          modelo?: string
          nome?: string
          observacoes?: string | null
          placa?: string | null
          status?: string
          telefone?: string
          user_id?: string | null
          versao?: string | null
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          email: string
          endereco: string
          horario: string
          id: number
          instagram: string | null
          logo_url: string | null
          nome: string
          sobre_texto: string
          taxa_juros_padrao: number
          telefone: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          email?: string
          endereco?: string
          horario?: string
          id?: number
          instagram?: string | null
          logo_url?: string | null
          nome?: string
          sobre_texto?: string
          taxa_juros_padrao?: number
          telefone?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          email?: string
          endereco?: string
          horario?: string
          id?: number
          instagram?: string | null
          logo_url?: string | null
          nome?: string
          sobre_texto?: string
          taxa_juros_padrao?: number
          telefone?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      contatos: {
        Row: {
          assunto: string | null
          created_at: string
          email: string
          id: string
          mensagem: string
          nome: string
          status: string
          telefone: string | null
          user_id: string | null
        }
        Insert: {
          assunto?: string | null
          created_at?: string
          email: string
          id?: string
          mensagem: string
          nome: string
          status?: string
          telefone?: string | null
          user_id?: string | null
        }
        Update: {
          assunto?: string | null
          created_at?: string
          email?: string
          id?: string
          mensagem?: string
          nome?: string
          status?: string
          telefone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      favoritos: {
        Row: {
          created_at: string
          id: string
          user_id: string
          veiculo_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          veiculo_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      financiamentos: {
        Row: {
          cpf: string | null
          created_at: string
          email: string | null
          entrada: number
          id: string
          nome: string
          parcela_estimada: number | null
          parcelas: number
          status: string
          taxa_juros: number
          telefone: string
          user_id: string | null
          valor_veiculo: number
          veiculo_id: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          email?: string | null
          entrada?: number
          id?: string
          nome: string
          parcela_estimada?: number | null
          parcelas?: number
          status?: string
          taxa_juros?: number
          telefone: string
          user_id?: string | null
          valor_veiculo: number
          veiculo_id?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string
          email?: string | null
          entrada?: number
          id?: string
          nome?: string
          parcela_estimada?: number | null
          parcelas?: number
          status?: string
          taxa_juros?: number
          telefone?: string
          user_id?: string | null
          valor_veiculo?: number
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financiamentos_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          mensagem: string | null
          nome: string
          origem: string
          status: string
          telefone: string
          user_id: string | null
          veiculo_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          mensagem?: string | null
          nome: string
          origem?: string
          status?: string
          telefone: string
          user_id?: string | null
          veiculo_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          mensagem?: string | null
          nome?: string
          origem?: string
          status?: string
          telefone?: string
          user_id?: string | null
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nome: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      veiculo_fotos: {
        Row: {
          capa: boolean
          created_at: string
          id: string
          ordem: number
          url: string
          veiculo_id: string
        }
        Insert: {
          capa?: boolean
          created_at?: string
          id?: string
          ordem?: number
          url: string
          veiculo_id: string
        }
        Update: {
          capa?: boolean
          created_at?: string
          id?: string
          ordem?: number
          url?: string
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "veiculo_fotos_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculos: {
        Row: {
          ano: number
          ano_modelo: number | null
          cambio: string
          carroceria: string
          combustivel: string
          cor: string | null
          created_at: string
          descricao: string | null
          destaque: boolean
          id: string
          km: number
          localizacao: string | null
          marca: string
          modelo: string
          opcionais: string[]
          placa: string | null
          portas: number | null
          preco: number
          preco_promocional: number | null
          publicado: boolean
          status: string
          updated_at: string
          versao: string | null
        }
        Insert: {
          ano: number
          ano_modelo?: number | null
          cambio?: string
          carroceria?: string
          combustivel?: string
          cor?: string | null
          created_at?: string
          descricao?: string | null
          destaque?: boolean
          id?: string
          km?: number
          localizacao?: string | null
          marca: string
          modelo: string
          opcionais?: string[]
          placa?: string | null
          portas?: number | null
          preco: number
          preco_promocional?: number | null
          publicado?: boolean
          status?: string
          updated_at?: string
          versao?: string | null
        }
        Update: {
          ano?: number
          ano_modelo?: number | null
          cambio?: string
          carroceria?: string
          combustivel?: string
          cor?: string | null
          created_at?: string
          descricao?: string | null
          destaque?: boolean
          id?: string
          km?: number
          localizacao?: string | null
          marca?: string
          modelo?: string
          opcionais?: string[]
          placa?: string | null
          portas?: number | null
          preco?: number
          preco_promocional?: number | null
          publicado?: boolean
          status?: string
          updated_at?: string
          versao?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "cliente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "cliente"],
    },
  },
} as const
