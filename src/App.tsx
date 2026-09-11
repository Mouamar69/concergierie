import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ArrowRight, ArrowUpRight, Check, ChevronRight, ChevronDown,
  MapPin, Phone, Mail, Home, Calendar, MessageSquare, Key, Sparkles,
  Building2, Star, Clock, Users, TrendingUp, Filter, Search, Eye,
  AlertCircle, BarChart3, Target, Zap, Shield, FileText, Activity,
  Flame, Globe, Layers, Settings, Bell, LogOut, Plus, Edit, Trash2, Database, CheckCircle2, XCircle
} from 'lucide-react';
import { supabase, leadsApi } from './lib/supabase';

// ============ IMAGES ============
const IMAGES = {
  hero: 'https://image.qwenlm.ai/generated-images/1db46c94-6f03-4b79-a6a2-effc91ecbc81/_result.png',
  facade: 'https://image.qwenlm.ai/generated-images/838a106f-d125-4c2d-ba36-01c204dcab1f/_result.png',
  chambre: 'https://image.qwenlm.ai/generated-images/a47fde5f-a2a0-4257-a27d-9a0725de7793/_result.png',
  salon: 'https://image.qwenlm.ai/generated-images/8db8995c-7dad-417c-be40-58f2948ef9df/_result.png',
  amenities: 'https://image.qwenlm.ai/generated-images/53869858-7d26-4f40-ac0d-f06362fc5bb6/_result.png',
};

// ============ TYPES ============
type Page = 'home' | 'admin';

interface Lead {
  id: number;
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  ville: string;
  nombreBiens: number;
  plateformes: string[];
  situation: string;
  motivation: string;
  score: number;
  statut: string;
  source: string;
  date: string;
  notes: string[];
}

// ============ DONNÉES DE FALLBACK ============
const sampleLeads: Lead[] = [
  {
    id: 1, prenom: 'Marie', nom: 'Dubois', telephone: '06 12 34 56 78', email: 'marie.dubois@email.com',
    ville: 'Paris 11e', nombreBiens: 3, plateformes: ['Airbnb', 'Booking'], situation: 'Je gère tout moi-même',
    motivation: 'Je manque de temps', score: 92, statut: 'Intéressé', source: 'Site KBG', date: '2024-01-15',
    notes: ['Appel le 16/01 - Très intéressée', 'RDV prévu le 22/01']
  },
  {
    id: 2, prenom: 'Thomas', nom: 'Martin', telephone: '06 98 76 54 32', email: 'thomas.martin@email.com',
    ville: 'Paris 3e', nombreBiens: 4, plateformes: ['Airbnb', 'Booking', 'Abritel'], situation: 'J\'ai déjà une conciergerie',
    motivation: 'Je veux améliorer mes revenus', score: 88, statut: 'Rendez-vous', source: 'Facebook', date: '2024-01-14',
    notes: ['RDV le 20/01 à 14h']
  },
  {
    id: 3, prenom: 'Sophie', nom: 'Laurent', telephone: '06 11 22 33 44', email: 'sophie.laurent@email.com',
    ville: 'Boulogne', nombreBiens: 1, plateformes: ['Pas encore'], situation: 'Je prépare actuellement le lancement',
    motivation: 'Je souhaite lancer mon logement', score: 65, statut: 'À contacter', source: 'Leboncoin', date: '2024-01-13',
    notes: []
  },
  {
    id: 4, prenom: 'Pierre', nom: 'Moreau', telephone: '06 55 66 77 88', email: 'pierre.moreau@email.com',
    ville: 'Paris 16e', nombreBiens: 2, plateformes: ['Airbnb'], situation: 'Je délègue certaines tâches',
    motivation: 'Je veux déléguer la gestion', score: 78, statut: 'Contacté', source: 'Site KBG', date: '2024-01-12',
    notes: ['Email envoyé le 13/01']
  },
  {
    id: 5, prenom: 'Isabelle', nom: 'Petit', telephone: '06 99 88 77 66', email: 'isabelle.petit@email.com',
    ville: 'Neuilly', nombreBiens: 1, plateformes: ['Booking'], situation: 'Je gère tout moi-même',
    motivation: 'Je manque de temps', score: 72, statut: 'Nouveau', source: 'Google Maps', date: '2024-01-11',
    notes: []
  },
];

// ============ APP PRINCIPAL ============
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // Charger les leads depuis Supabase au démarrage
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      // Vérifier si Supabase est configuré
      const isConfigured = import.meta.env.VITE_SUPABASE_URL && 
                          import.meta.env.VITE_SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co';
      
      if (isConfigured) {
        const data = await leadsApi.getAll();
        // Convertir les données de Supabase au format de l'application
        const formattedLeads: Lead[] = data.map((lead: any) => ({
          id: lead.id,
          prenom: lead.prenom,
          nom: lead.nom,
          telephone: lead.telephone,
          email: lead.email,
          ville: lead.ville,
          nombreBiens: lead.nombre_biens,
          plateformes: lead.plateformes || [],
          situation: lead.situation,
          motivation: lead.motivation,
          score: lead.score,
          statut: lead.statut,
          source: lead.source,
          date: lead.date,
          notes: lead.notes || [],
        }));
        setLeads(formattedLeads);
        setSupabaseConnected(true);
      } else {
        // Fallback sur les données locales
        setLeads(sampleLeads);
        setSupabaseConnected(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des leads:', error);
      // Fallback sur les données locales en cas d'erreur
      setLeads(sampleLeads);
      setSupabaseConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un nouveau lead
  const addLead = async (newLead: Omit<Lead, 'id'>) => {
    try {
      const isConfigured = import.meta.env.VITE_SUPABASE_URL && 
                          import.meta.env.VITE_SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co';
      
      if (isConfigured) {
        // Sauvegarder dans Supabase
        const savedLead = await leadsApi.create({
          prenom: newLead.prenom,
          nom: newLead.nom,
          telephone: newLead.telephone,
          email: newLead.email,
          ville: newLead.ville,
          nombre_biens: newLead.nombreBiens,
          plateformes: newLead.plateformes,
          situation: newLead.situation,
          motivation: newLead.motivation,
          score: newLead.score,
          statut: newLead.statut,
          source: newLead.source,
          date: newLead.date,
          notes: newLead.notes,
        });
        
        // Ajouter le lead à l'état local avec l'ID de Supabase
        const leadWithId: Lead = {
          ...newLead,
          id: savedLead.id,
        };
        setLeads([leadWithId, ...leads]);
      } else {
        // Fallback : ajouter localement
        const leadWithId: Lead = {
          ...newLead,
          id: leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1,
        };
        setLeads([leadWithId, ...leads]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du lead:', error);
      // Fallback : ajouter localement en cas d'erreur
      const leadWithId: Lead = {
        ...newLead,
        id: leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1,
      };
      setLeads([leadWithId, ...leads]);
    }
  };

  // Mettre à jour un lead
  const updateLead = async (id: number, updates: Partial<Lead>) => {
    try {
      const isConfigured = import.meta.env.VITE_SUPABASE_URL && 
                          import.meta.env.VITE_SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co';
      
      if (isConfigured) {
        // Convertir les noms de champs pour Supabase
        const supabaseUpdates: any = { ...updates };
        if (updates.nombreBiens !== undefined) {
          supabaseUpdates.nombre_biens = updates.nombreBiens;
          delete supabaseUpdates.nombreBiens;
        }
        await leadsApi.update(id, supabaseUpdates);
      }
      
      // Mettre à jour l'état local
      setLeads(leads.map(l => l.id === id ? { ...l, ...updates } : l));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du lead:', error);
      // Mettre à jour localement même en cas d'erreur
      setLeads(leads.map(l => l.id === id ? { ...l, ...updates } : l));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="font-serif text-[#f5f3ef] text-2xl font-semibold">K</span>
          </div>
          <p className="text-[#8a8578]">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} leads={leads} addLead={addLead} supabaseConnected={supabaseConnected} />}
      {currentPage === 'admin' && <AdminPage leads={leads} updateLead={updateLead} onNavigate={setCurrentPage} supabaseConnected={supabaseConnected} onRefresh={loadLeads} />}
    </>
  );
}

// ============ NAVIGATION ============
function Navigation({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#faf9f7]/95 backdrop-blur-md border-b border-[#d4cfc5]/30' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
              <span className="font-serif text-[#f5f3ef] text-lg font-semibold">K</span>
            </div>
            <span className="font-serif text-xl text-[#1a1a1a] tracking-tight">KBG</span>
          </button>

          <div className="hidden md:flex items-center gap-10">
            <a href="#approche" className="text-sm text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors">Notre approche</a>
            <a href="#services" className="text-sm text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors">Services</a>
            <a href="#pour-qui" className="text-sm text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors">Pour les propriétaires</a>
            <a href="#faq" className="text-sm text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('admin')}
              className="hidden md:block text-sm text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors"
            >
              Espace KBG
            </button>
            <a
              href="#diagnostic"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-[#f5f3ef] text-sm font-medium rounded-full hover:bg-[#2a2a2a] transition-colors"
            >
              Estimer mon bien
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1a1a1a]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#faf9f7] border-t border-[#d4cfc5]/30"
          >
            <div className="px-6 py-6 space-y-4">
              <a href="#approche" className="block text-[#1a1a1a]/70">Notre approche</a>
              <a href="#services" className="block text-[#1a1a1a]/70">Services</a>
              <a href="#pour-qui" className="block text-[#1a1a1a]/70">Pour les propriétaires</a>
              <a href="#faq" className="block text-[#1a1a1a]/70">FAQ</a>
              <a href="#diagnostic" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-[#f5f3ef] text-sm font-medium rounded-full">
                Estimer mon bien
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ============ HOME PAGE ============
function HomePage({ onNavigate, leads, addLead, supabaseConnected }: { onNavigate: (page: Page) => void; leads: Lead[]; addLead: (newLead: Omit<Lead, 'id'>) => Promise<void>; supabaseConnected: boolean }) {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navigation onNavigate={onNavigate} />
      
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.hero}
            alt="Appartement parisien haut de gamme"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <p className="text-[#c9a961] text-sm font-medium tracking-wider uppercase mb-6">
              Paris · Île-de-France
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#f5f3ef] leading-[1.1] mb-6">
              Votre bien mérite mieux qu'une gestion à temps partiel.
            </h1>
            <p className="text-[#f5f3ef]/80 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              KBG Conciergerie prend en charge votre location courte durée à Paris et en Île-de-France, de la réservation au dernier départ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#diagnostic"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#f5f3ef] text-[#1a1a1a] font-medium rounded-full hover:bg-[#e5d4a3] transition-colors"
              >
                Estimer mon bien
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#approche"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#f5f3ef]/30 text-[#f5f3ef] font-medium rounded-full hover:bg-[#f5f3ef]/10 transition-colors"
              >
                Découvrir KBG
              </a>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-[#f5f3ef]/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-[#f5f3ef]/60 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* TIMELINE - UNE JOURNÉE DE PROPRIÉTAIRE */}
      <section id="approche" className="py-24 md:py-32 bg-[#f5f3ef]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-16"
          >
            <p className="text-[#8a8578] text-sm font-medium tracking-wider uppercase mb-4">
              Le quotidien d'un propriétaire
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] leading-tight">
              Une location courte durée, c'est rarement juste une réservation.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {[
                { time: '07:32', text: 'Message d\'un voyageur', icon: MessageSquare },
                { time: '09:14', text: 'Check-in à organiser', icon: Key },
                { time: '11:46', text: 'Ménage à confirmer', icon: Sparkles },
                { time: '14:21', text: 'Problème de serrure', icon: AlertCircle },
                { time: '18:05', text: 'Nouvelle réservation', icon: Calendar },
                { time: '22:17', text: 'Question du voyageur', icon: MessageSquare },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-[#faf9f7] rounded-lg border border-[#d4cfc5]/30"
                >
                  <span className="text-sm font-mono text-[#8a8578] w-14">{item.time}</span>
                  <item.icon className="w-5 h-5 text-[#3d3429]" />
                  <span className="text-[#1a1a1a]/80">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center md:text-left"
            >
              <div className="inline-block p-8 md:p-12 bg-[#1a1a1a] rounded-2xl">
                <p className="font-serif text-3xl md:text-4xl text-[#f5f3ef] leading-tight mb-6">
                  Et si tout cela ne vous concernait plus ?
                </p>
                <p className="text-[#c9a961] text-xl font-serif italic">
                  KBG prend le relais.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* KBG PREND LE RELAIS - VISUEL */}
      <section className="py-24 md:py-32 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] mb-4">
              Un seul interlocuteur.<br />Une gestion complète.
            </h2>
            <p className="text-[#8a8578] text-lg max-w-2xl mx-auto">
              Votre logement reste au centre. Nous gérons tout ce qui l'entoure.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Centre - Logement */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-40 h-40 mx-auto mb-12"
            >
              <div className="absolute inset-0 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                <Building2 className="w-16 h-16 text-[#c9a961]" />
              </div>
              <div className="absolute inset-0 border-2 border-[#c9a961]/30 rounded-full animate-ping" />
            </motion.div>

            {/* Services autour */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Calendar, label: 'Réservation' },
                { icon: Users, label: 'Voyageur' },
                { icon: Key, label: 'Check-in' },
                { icon: Sparkles, label: 'Ménage' },
                { icon: Home, label: 'Linge' },
                { icon: Settings, label: 'Maintenance' },
                { icon: TrendingUp, label: 'Optimisation' },
                { icon: MessageSquare, label: 'Communication' },
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center gap-3 p-6 bg-[#f5f3ef] rounded-xl border border-[#d4cfc5]/30 hover:border-[#c9a961]/50 transition-colors"
                >
                  <service.icon className="w-6 h-6 text-[#3d3429]" />
                  <span className="text-sm text-[#1a1a1a]/80 text-center">{service.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE VISUELLE */}
      <section className="py-24 md:py-32 bg-[#f5f3ef]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#8a8578] text-sm font-medium tracking-wider uppercase mb-4">
              L'excellence au quotidien
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a]">
              Des logements d'exception.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="md:col-span-2 rounded-2xl overflow-hidden aspect-[16/10]"
            >
              <img src={IMAGES.salon} alt="Salon parisien" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl overflow-hidden aspect-[4/5]"
            >
              <img src={IMAGES.facade} alt="Façade parisienne" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl overflow-hidden aspect-[4/5]"
            >
              <img src={IMAGES.chambre} alt="Chambre premium" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 rounded-2xl overflow-hidden aspect-[16/10]"
            >
              <img src={IMAGES.amenities} alt="Services premium" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* POUR QUI */}
      <section id="pour-qui" className="py-24 md:py-32 bg-[#f5f3ef]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#8a8578] text-sm font-medium tracking-wider uppercase mb-4">
              Pour les propriétaires
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a]">
              Êtes-vous concerné ?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Le propriétaire qui manque de temps',
                description: 'Vous gérez tout vous-même et les messages, check-in et imprévus commencent à prendre trop de place.',
                icon: Clock
              },
              {
                title: 'Le propriétaire de plusieurs biens',
                description: 'Plusieurs logements, plusieurs voyageurs, plusieurs équipes : KBG centralise la gestion.',
                icon: Building2
              },
              {
                title: 'Le propriétaire qui veut se lancer',
                description: 'Vous possédez un logement mais ne savez pas comment structurer son exploitation en courte durée.',
                icon: Star
              },
            ].map((profile, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 bg-[#faf9f7] rounded-2xl border border-[#d4cfc5]/30 hover:border-[#c9a961]/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6 group-hover:bg-[#c9a961] transition-colors">
                  <profile.icon className="w-6 h-6 text-[#f5f3ef]" />
                </div>
                <h3 className="font-serif text-2xl text-[#1a1a1a] mb-4">{profile.title}</h3>
                <p className="text-[#8a8578] leading-relaxed">{profile.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#diagnostic"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] text-[#f5f3ef] font-medium rounded-full hover:bg-[#2a2a2a] transition-colors"
            >
              Parler de mon projet
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 md:py-32 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <p className="text-[#8a8578] text-sm font-medium tracking-wider uppercase mb-4">
              Nos services
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] leading-tight">
              Une gestion complète, pensée pour votre tranquillité.
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { num: '01', title: 'Votre annonce', desc: 'Création et optimisation professionnelle de vos annonces sur toutes les plateformes.' },
              { num: '02', title: 'Vos réservations', desc: 'Gestion complète des calendriers, tarifs et réservations.' },
              { num: '03', title: 'Vos voyageurs', desc: 'Communication avant, pendant et après le séjour. 24h/24.' },
              { num: '04', title: 'Votre logement', desc: 'Check-in, check-out, ménage, linge et suivi quotidien.' },
              { num: '05', title: 'Vos performances', desc: 'Optimisation continue de l\'exploitation et des revenus.' },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex items-center gap-6 md:gap-10 p-6 md:p-8 bg-[#f5f3ef] rounded-xl border border-[#d4cfc5]/30 hover:border-[#c9a961]/50 hover:bg-[#faf9f7] transition-all cursor-pointer"
              >
                <span className="font-serif text-4xl md:text-5xl text-[#c9a961]/40 group-hover:text-[#c9a961] transition-colors">
                  {service.num}
                </span>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-2">{service.title}</h3>
                  <p className="text-[#8a8578]">{service.desc}</p>
                </div>
                <ArrowUpRight className="w-6 h-6 text-[#1a1a1a]/30 group-hover:text-[#c9a961] transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC */}
      <DiagnosticSection leads={leads} addLead={addLead} supabaseConnected={supabaseConnected} />

      {/* FAQ */}
      <section id="faq" className="py-24 md:py-32 bg-[#f5f3ef]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#8a8578] text-sm font-medium tracking-wider uppercase mb-4">
              Questions fréquentes
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a]">
              FAQ
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'Comment fonctionne la rémunération de KBG ?', a: 'KBG prend en charge la gestion complète de votre logement en échange d\'un pourcentage sur les revenus générés. Aucun frais fixe, aucun engagement de durée.' },
              { q: 'Dois-je fournir le linge et les équipements ?', a: 'Nous pouvons gérer l\'ensemble du linge et des équipements. Vous n\'avez rien à acheter ni à entretenir.' },
              { q: 'Que se passe-t-il en cas de problème avec un voyageur ?', a: 'KBG gère l\'intégralité des incidents. Notre équipe est disponible 24h/24 pour résoudre toute situation.' },
              { q: 'Puis-je utiliser mon logement personnellement ?', a: 'Absolument. Vous gardez l\'entière disposition de votre bien quand vous le souhaitez.' },
              { q: 'Sur quelles plateformes mon logement sera-t-il publié ?', a: 'Airbnb, Booking, Abritel et toute autre plateforme pertinente pour maximiser votre visibilité.' },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 bg-[#1a1a1a] text-[#f5f3ef]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#f5f3ef] flex items-center justify-center">
                  <span className="font-serif text-[#1a1a1a] text-lg font-semibold">K</span>
                </div>
                <span className="font-serif text-xl">KBG</span>
              </div>
              <p className="text-[#f5f3ef]/60 text-sm leading-relaxed">
                Gestion premium de locations courte durée à Paris et en Île-de-France.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Navigation</h4>
              <ul className="space-y-2 text-[#f5f3ef]/60 text-sm">
                <li><a href="#approche" className="hover:text-[#f5f3ef] transition-colors">Notre approche</a></li>
                <li><a href="#services" className="hover:text-[#f5f3ef] transition-colors">Services</a></li>
                <li><a href="#pour-qui" className="hover:text-[#f5f3ef] transition-colors">Pour les propriétaires</a></li>
                <li><a href="#faq" className="hover:text-[#f5f3ef] transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-[#f5f3ef]/60 text-sm">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Paris, France</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contact@kbg-conciergerie.fr</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> 01 23 45 67 89</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Zone d'intervention</h4>
              <p className="text-[#f5f3ef]/60 text-sm leading-relaxed">
                Paris intra-muros et toute l'Île-de-France.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-[#f5f3ef]/10 text-center text-[#f5f3ef]/40 text-sm">
            © 2024 KBG Conciergerie. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============ FAQ ITEM ============
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#faf9f7] rounded-xl border border-[#d4cfc5]/30 overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-serif text-xl text-[#1a1a1a] pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[#8a8578] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-[#8a8578] leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============ DIAGNOSTIC SECTION ============
function DiagnosticSection({ leads, addLead, supabaseConnected }: { leads: Lead[]; addLead: (newLead: Omit<Lead, 'id'>) => Promise<void>; supabaseConnected: boolean }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [formData, setFormData] = useState({ prenom: '', nom: '', telephone: '', email: '', ville: '', nombreBiens: '1' });
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    { key: 'localisation', question: 'Où se situe votre logement ?', options: ['Paris', 'Petite couronne', 'Grande couronne', 'Autre'] },
    { key: 'biens', question: 'Combien de logements possédez-vous ?', options: ['1', '2-3', '4+'] },
    { key: 'plateforme', question: 'Votre logement est-il déjà exploité ?', options: ['Airbnb', 'Booking', 'Plusieurs plateformes', 'Pas encore'] },
    { key: 'gestion', question: 'Comment gérez-vous actuellement votre logement ?', options: ['Je gère tout moi-même', 'Je délègue certaines tâches', 'J\'ai déjà une conciergerie', 'Je prépare actuellement le lancement'] },
    { key: 'motivation', question: 'Pourquoi recherchez-vous une solution ?', options: ['Je manque de temps', 'Je veux déléguer la gestion', 'Je veux améliorer mes revenus', 'Je veux professionnaliser mon exploitation', 'Je souhaite lancer mon logement'] },
  ];

  const calculateScore = () => {
    let score = 0;
    if (answers.localisation === 'Paris') score += 20;
    else if (answers.localisation === 'Petite couronne') score += 10;
    if (answers.biens === '4+') score += 15;
    else if (answers.biens === '2-3') score += 10;
    if (answers.plateforme === 'Plusieurs plateformes') score += 15;
    else if (answers.plateforme === 'Airbnb' || answers.plateforme === 'Booking') score += 10;
    if (answers.gestion === 'J\'ai déjà une conciergerie') score += 10;
    else if (answers.gestion === 'Je gère tout moi-même') score += 15;
    if (answers.motivation === 'Je manque de temps' || answers.motivation === 'Je veux déléguer la gestion') score += 20;
    else if (answers.motivation === 'Je veux améliorer mes revenus') score += 15;
    return score;
  };

  const getScoreCategory = (score: number) => {
    if (score >= 80) return { label: 'Très qualifié', emoji: '🔥', color: 'text-red-600' };
    if (score >= 60) return { label: 'Qualifié', emoji: '🟠', color: 'text-orange-600' };
    if (score >= 40) return { label: 'À vérifier', emoji: '🟡', color: 'text-yellow-600' };
    return { label: 'Non qualifié', emoji: '❌', color: 'text-gray-600' };
  };

  const handleAnswer = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => setShowForm(true), 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateScore();
    const newLead: Omit<Lead, 'id'> = {
      prenom: formData.prenom,
      nom: formData.nom,
      telephone: formData.telephone,
      email: formData.email,
      ville: formData.ville || answers.localisation || 'Non précisé',
      nombreBiens: parseInt(formData.nombreBiens) || 1,
      plateformes: answers.plateforme ? [answers.plateforme] : [],
      situation: answers.gestion || 'Non précisé',
      motivation: answers.motivation || 'Non précisé',
      score,
      statut: 'Nouveau',
      source: 'Site KBG',
      date: new Date().toISOString().split('T')[0],
      notes: [],
    };
    await addLead(newLead);
    setSubmitted(true);
    setShowResult(true);
  };

  const resetDiagnostic = () => {
    setStep(0);
    setAnswers({});
    setShowForm(false);
    setShowResult(false);
    setSubmitted(false);
    setFormData({ prenom: '', nom: '', telephone: '', email: '', ville: '', nombreBiens: '1' });
  };

  const score = calculateScore();
  const scoreCategory = getScoreCategory(score);

  return (
    <section id="diagnostic" className="py-24 md:py-32 bg-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[#c9a961] text-sm font-medium tracking-wider uppercase mb-4">
            Le Diagnostic KBG
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#f5f3ef] mb-4">
            En quelques questions, découvrez comment nous pourrions gérer votre logement.
          </h2>
        </motion.div>

        {!showForm && !showResult && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#f5f3ef] rounded-2xl p-8 md:p-12"
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#8a8578]">Question {step + 1} / {questions.length}</span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div key={i} className={`w-8 h-1 rounded-full ${i <= step ? 'bg-[#c9a961]' : 'bg-[#d4cfc5]'}`} />
                  ))}
                </div>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#1a1a1a]">
                {questions[step].question}
              </h3>
            </div>

            <div className="space-y-3">
              {questions[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(questions[step].key, option)}
                  className="w-full p-4 text-left bg-[#faf9f7] border border-[#d4cfc5]/30 rounded-xl hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-all group"
                >
                  <span className="text-[#1a1a1a] group-hover:text-[#3d3429]">{option}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {showForm && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#f5f3ef] rounded-2xl p-8 md:p-12"
          >
            <h3 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-2">
              Recevez votre analyse personnalisée
            </h3>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 ${
              supabaseConnected 
                ? 'bg-green-500/10 text-green-700 border border-green-500/20' 
                : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
            }`}>
              {supabaseConnected ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Vos données seront sauvegardées</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  <span>Mode démo - Données non sauvegardées</span>
                </>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Prénom"
                  required
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="p-4 bg-[#faf9f7] border border-[#d4cfc5]/30 rounded-xl focus:border-[#c9a961] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="p-4 bg-[#faf9f7] border border-[#d4cfc5]/30 rounded-xl focus:border-[#c9a961] focus:outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Téléphone"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="p-4 bg-[#faf9f7] border border-[#d4cfc5]/30 rounded-xl focus:border-[#c9a961] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="p-4 bg-[#faf9f7] border border-[#d4cfc5]/30 rounded-xl focus:border-[#c9a961] focus:outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ville du bien"
                  value={formData.ville}
                  onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                  className="p-4 bg-[#faf9f7] border border-[#d4cfc5]/30 rounded-xl focus:border-[#c9a961] focus:outline-none"
                />
                <select
                  value={formData.nombreBiens}
                  onChange={(e) => setFormData({ ...formData, nombreBiens: e.target.value })}
                  className="p-4 bg-[#faf9f7] border border-[#d4cfc5]/30 rounded-xl focus:border-[#c9a961] focus:outline-none"
                >
                  <option value="1">1 logement</option>
                  <option value="2">2-3 logements</option>
                  <option value="4">4+ logements</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full p-4 bg-[#1a1a1a] text-[#f5f3ef] font-medium rounded-xl hover:bg-[#2a2a2a] transition-colors"
              >
                Recevoir mon analyse
              </button>
            </form>
          </motion.div>
        )}

        {showResult && submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#f5f3ef] rounded-2xl p-8 md:p-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#c9a961]/10 flex items-center justify-center">
              <Check className="w-10 h-10 text-[#c9a961]" />
            </div>
            <h3 className="font-serif text-3xl text-[#1a1a1a] mb-4">
              Merci {formData.prenom}.
            </h3>
            <p className="text-[#8a8578] text-lg mb-6">
              Votre demande a bien été transmise à KBG.<br />
              Nous reviendrons vers vous afin d'échanger sur votre logement.
            </p>
            <div className="inline-block p-6 bg-[#faf9f7] rounded-xl border border-[#d4cfc5]/30 mb-6">
              <p className={`text-2xl font-bold ${scoreCategory.color} mb-1`}>
                {scoreCategory.emoji} {scoreCategory.label}
              </p>
              <p className="text-sm text-[#8a8578]">Score : {score}/100</p>
            </div>
            <p className="text-sm text-[#8a8578] mb-8">
              Cette analyse est indicative. Une étude personnalisée de votre logement permet de déterminer précisément son potentiel.
            </p>
            <button
              onClick={resetDiagnostic}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-[#f5f3ef] rounded-full hover:bg-[#2a2a2a] transition-colors"
            >
              Nouveau diagnostic
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ============ ADMIN PAGE ============
function AdminPage({ leads, updateLead, onNavigate, supabaseConnected, onRefresh }: { leads: Lead[]; updateLead: (id: number, updates: Partial<Lead>) => Promise<void>; onNavigate: (page: Page) => void; supabaseConnected: boolean; onRefresh: () => Promise<void> }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatut, setFilterStatut] = useState('all');
  const [filterScore, setFilterScore] = useState('all');

  const filteredLeads = leads.filter(lead => {
    if (filterStatut !== 'all' && lead.statut !== filterStatut) return false;
    if (filterScore !== 'all') {
      if (filterScore === 'high' && lead.score < 80) return false;
      if (filterScore === 'medium' && (lead.score < 60 || lead.score >= 80)) return false;
      if (filterScore === 'low' && lead.score >= 60) return false;
    }
    return true;
  });

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.score >= 60).length;
  const highQualityLeads = leads.filter(l => l.score >= 80).length;
  const rdvLeads = leads.filter(l => l.statut === 'Rendez-vous').length;
  const clients = leads.filter(l => l.statut === 'Client').length;

  const updateLeadStatus = async (id: number, newStatus: string) => {
    await updateLead(id, { statut: newStatus });
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, statut: newStatus });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 h-14 border-b border-white/[0.05] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-xs font-bold">K</span>
              </div>
              <span className="text-sm font-medium">KBG Admin</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            {/* Indicateur de connexion Supabase */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              supabaseConnected 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {supabaseConnected ? (
                <>
                  <Database className="w-3 h-3" />
                  <span>Supabase connecté</span>
                </>
              ) : (
                <>
                  <Database className="w-3 h-3" />
                  <span>Mode local</span>
                </>
              )}
            </div>
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white/60 transition-colors"
              title="Rafraîchir les données"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white/60 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Quitter
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">Gestion des prospects KBG</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <AdminKPICard icon={Users} label="Total Leads" value={totalLeads} color="blue" />
          <AdminKPICard icon={Check} label="Qualifiés" value={qualifiedLeads} color="green" />
          <AdminKPICard icon={Flame} label="Très qualifiés" value={highQualityLeads} color="red" />
          <AdminKPICard icon={Calendar} label="Rendez-vous" value={rdvLeads} color="purple" />
          <AdminKPICard icon={Star} label="Clients" value={clients} color="amber" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/60 focus:outline-none focus:ring-1 focus:ring-white/10"
          >
            <option value="all">Tous les statuts</option>
            <option value="Nouveau">Nouveau</option>
            <option value="À contacter">À contacter</option>
            <option value="Contacté">Contacté</option>
            <option value="Intéressé">Intéressé</option>
            <option value="Rendez-vous">Rendez-vous</option>
            <option value="Client">Client</option>
            <option value="Non qualifié">Non qualifié</option>
          </select>
          <select
            value={filterScore}
            onChange={(e) => setFilterScore(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/60 focus:outline-none focus:ring-1 focus:ring-white/10"
          >
            <option value="all">Tous les scores</option>
            <option value="high">🔥 Très qualifié (80+)</option>
            <option value="medium">🟠 Qualifié (60-79)</option>
            <option value="low">🟡 À vérifier (&lt;60)</option>
          </select>
        </div>

        {/* Leads Table */}
        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                  <th className="text-left px-4 py-3 font-medium text-white/40">Prospect</th>
                  <th className="text-left px-4 py-3 font-medium text-white/40 hidden md:table-cell">Ville</th>
                  <th className="text-left px-4 py-3 font-medium text-white/40 hidden lg:table-cell">Biens</th>
                  <th className="text-left px-4 py-3 font-medium text-white/40 hidden lg:table-cell">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-white/40">Score</th>
                  <th className="text-left px-4 py-3 font-medium text-white/40">Statut</th>
                  <th className="text-left px-4 py-3 font-medium text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{lead.prenom} {lead.nom}</p>
                      <p className="text-xs text-white/30">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-white/60">{lead.ville}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-white/60">{lead.nombreBiens}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/10">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBadge score={lead.score} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge statut={lead.statut} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.05] text-white/40 hover:text-white/60 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onUpdateStatus={updateLeadStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ ADMIN COMPONENTS ============
function AdminKPICard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-400',
    red: 'text-red-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
  };

  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4">
      <Icon className={`w-4 h-4 ${colorMap[color]} mb-2`} />
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-white/40 mt-0.5">{label}</p>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                score >= 60 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  return (
    <span className={`inline-flex items-center justify-center w-10 h-6 rounded text-xs font-medium border ${color}`}>
      {score}
    </span>
  );
}

function StatusBadge({ statut }: { statut: string }) {
  const colorMap: Record<string, string> = {
    'Nouveau': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'À contacter': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Contacté': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Intéressé': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Rendez-vous': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Client': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Non qualifié': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${colorMap[statut] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
      {statut}
    </span>
  );
}

function LeadDetailModal({ lead, onClose, onUpdateStatus }: { lead: Lead; onClose: () => void; onUpdateStatus: (id: number, status: string) => void }) {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(lead.notes);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-white/[0.08] bg-[#0f0f14] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">{lead.prenom} {lead.nom}</h3>
              <p className="text-sm text-white/40 mt-1">Lead #{lead.id} · {lead.date}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/[0.05] text-white/30 hover:text-white/60 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Score & Status */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/40">Score :</span>
              <ScoreBadge score={lead.score} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/40">Statut :</span>
              <select
                value={lead.statut}
                onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1 text-sm text-white/70 focus:outline-none"
              >
                <option value="Nouveau">Nouveau</option>
                <option value="À contacter">À contacter</option>
                <option value="Contacté">Contacté</option>
                <option value="Intéressé">Intéressé</option>
                <option value="Rendez-vous">Rendez-vous</option>
                <option value="Client">Client</option>
                <option value="Non qualifié">Non qualifié</option>
              </select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <AdminInfoBlock icon={Phone} label="Téléphone" value={lead.telephone} />
            <AdminInfoBlock icon={Mail} label="Email" value={lead.email} />
            <AdminInfoBlock icon={MapPin} label="Ville" value={lead.ville} />
            <AdminInfoBlock icon={Home} label="Nombre de biens" value={String(lead.nombreBiens)} />
          </div>

          {/* Details */}
          <div className="space-y-3 mb-6">
            <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">Plateformes</p>
              <div className="flex flex-wrap gap-1.5">
                {lead.plateformes.map((p, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/10">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">Situation actuelle</p>
              <p className="text-sm text-white/70">{lead.situation}</p>
            </div>
            <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">Motivation</p>
              <p className="text-sm text-white/70">{lead.motivation}</p>
            </div>
            <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1">Source</p>
              <p className="text-sm text-white/70">{lead.source}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-6">
            <a href={`tel:${lead.telephone}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-sm">
              <Phone className="w-4 h-4" />
              Appeler
            </a>
            <a href={`mailto:${lead.email}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm">
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>

          {/* Notes */}
          <div className="border-t border-white/[0.05] pt-6">
            <h4 className="text-sm font-medium mb-3">Notes</h4>
            <div className="space-y-2 mb-3">
              {notes.map((note, i) => (
                <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-sm text-white/60">
                  {note}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ajouter une note..."
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-white/10"
              />
              <button
                onClick={addNote}
                className="px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-sm text-white/70 hover:bg-white/[0.1] transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AdminInfoBlock({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-white/20" />
        <p className="text-[10px] text-white/20 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-sm font-medium text-white/70">{value}</p>
    </div>
  );
}
