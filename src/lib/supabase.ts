import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
// Remplacez ces valeurs par vos propres clés depuis https://supabase.com
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour les leads
export interface Lead {
  id?: number
  prenom: string
  nom: string
  telephone: string
  email: string
  ville: string
  nombre_biens: number
  plateformes: string[]
  situation: string
  motivation: string
  score: number
  statut: string
  source: string
  date: string
  notes: string[]
  created_at?: string
  updated_at?: string
}

// Fonctions pour gérer les leads
export const leadsApi = {
  // Créer un nouveau lead
  create: async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Récupérer tous les leads
  getAll: async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Récupérer un lead par ID
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Mettre à jour un lead
  update: async (id: number, updates: Partial<Lead>) => {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Supprimer un lead
  delete: async (id: number) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Ajouter une note à un lead
  addNote: async (id: number, note: string) => {
    const lead = await leadsApi.getById(id)
    const notes = [...(lead.notes || []), note]
    return leadsApi.update(id, { notes })
  }
}
