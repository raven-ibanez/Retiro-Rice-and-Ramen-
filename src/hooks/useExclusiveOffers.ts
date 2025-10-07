import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ExclusiveOffer {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  original_price: number;
  discount_text: string | null;
  image_url: string | null;
  badge_text: string | null;
  available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExclusiveOffersSettings {
  enabled: boolean;
  auto_rotate: boolean;
  rotation_speed: number;
  title: string;
  subtitle: string;
  badge: string;
}

export const useExclusiveOffers = () => {
  const [offers, setOffers] = useState<ExclusiveOffer[]>([]);
  const [settings, setSettings] = useState<ExclusiveOffersSettings>({
    enabled: true,
    auto_rotate: true,
    rotation_speed: 6000,
    title: 'Premium Offerings',
    subtitle: 'Discover our signature collection of premium dishes crafted with exceptional ingredients',
    badge: 'EXCLUSIVE COLLECTION'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

         // Fetch exclusive offers
         const fetchOffers = async () => {
           try {
             const { data, error } = await supabase
               .from('exclusive_offers')
               .select('*')
               .order('display_order', { ascending: true });

             if (error) {
               console.error('Error fetching exclusive offers:', error);
               throw error;
             }
             
             setOffers(data || []);
           } catch (err) {
             console.error('Error fetching exclusive offers:', err);
             setError('Failed to fetch exclusive offers');
             throw err;
           }
         };

  // Fetch exclusive offers settings
  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .like('id', 'exclusive_offers_%');

      if (error) {
        console.error('Supabase error fetching exclusive offers settings:', error);
        throw error;
      }

      const settingsData: Partial<ExclusiveOffersSettings> = {};
      data?.forEach(setting => {
        switch (setting.id) {
          case 'exclusive_offers_enabled':
            settingsData.enabled = setting.value === 'true';
            break;
          case 'exclusive_offers_auto_rotate':
            settingsData.auto_rotate = setting.value === 'true';
            break;
          case 'exclusive_offers_rotation_speed':
            settingsData.rotation_speed = parseInt(setting.value) || 6000;
            break;
          case 'exclusive_offers_title':
            settingsData.title = setting.value || 'Premium Offerings';
            break;
          case 'exclusive_offers_subtitle':
            settingsData.subtitle = setting.value || 'Discover our signature collection of premium dishes crafted with exceptional ingredients';
            break;
          case 'exclusive_offers_badge':
            settingsData.badge = setting.value || 'EXCLUSIVE COLLECTION';
            break;
        }
      });

      setSettings(prev => ({ ...prev, ...settingsData }));
    } catch (err) {
      console.error('Error fetching exclusive offers settings:', err);
      setError('Failed to fetch exclusive offers settings');
    }
  };

  // Create new exclusive offer
  const createOffer = async (offer: Omit<ExclusiveOffer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('exclusive_offers')
        .insert([offer])
        .select();

      if (error) {
        console.error('❌ Supabase error creating offer:', error);
        throw error;
      }

      await fetchOffers();
      return data?.[0];
    } catch (err) {
      console.error('❌ Error creating exclusive offer:', err);
      setError('Failed to create exclusive offer');
      throw err;
    }
  };

  // Update exclusive offer
  const updateOffer = async (id: string, updates: Partial<ExclusiveOffer>) => {
    try {
      const { data, error } = await supabase
        .from('exclusive_offers')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        console.error('❌ Supabase error updating offer:', error);
        throw error;
      }

      await fetchOffers();
    } catch (err) {
      console.error('❌ Error updating exclusive offer:', err);
      setError('Failed to update exclusive offer');
      throw err;
    }
  };

  // Delete exclusive offer
  const deleteOffer = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('exclusive_offers')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('❌ Supabase error deleting offer:', error);
        throw error;
      }

      await fetchOffers();
    } catch (err) {
      console.error('❌ Error deleting exclusive offer:', err);
      setError('Failed to delete exclusive offer');
      throw err;
    }
  };

  // Toggle offer availability
  const toggleOfferStatus = async (id: string) => {
    try {
      const offer = offers.find(o => o.id === id);
      if (!offer) throw new Error('Offer not found');

      const newStatus = !offer.available;

      const { data, error } = await supabase
        .from('exclusive_offers')
        .update({ 
          available: newStatus
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase error toggling offer status:', error);
        throw error;
      }

      await fetchOffers();
    } catch (err) {
      console.error('Error toggling offer status:', err);
      setError('Failed to toggle offer status');
      throw err;
    }
  };

  // Update exclusive offers settings
  const updateSettings = async (newSettings: Partial<ExclusiveOffersSettings>) => {
    try {
      const updates = Object.entries(newSettings).map(([key, value]) => ({
        id: `exclusive_offers_${key}`,
        value: value?.toString() || '',
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: update.value, updated_at: update.updated_at })
          .eq('id', update.id);

        if (error) throw error;
      }

      await fetchSettings();
    } catch (err) {
      console.error('Error updating exclusive offers settings:', err);
      setError('Failed to update exclusive offers settings');
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Loading exclusive offers data...');
        await Promise.all([fetchOffers(), fetchSettings()]);
        console.log('✅ Successfully loaded exclusive offers data');
      } catch (err) {
        console.error('❌ Error loading exclusive offers data:', err);
        setError('Failed to load exclusive offers data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Force refresh function to clear cache
  const forceRefresh = async () => {
    console.log('🔄 Force refreshing exclusive offers data...');
    setLoading(true);
    setError(null);
    
    try {
      // Clear current data
      setOffers([]);
      setSettings({
        enabled: true,
        auto_rotate: true,
        rotation_speed: 6000,
        title: 'Premium Offerings',
        subtitle: 'Discover our signature collection of premium dishes crafted with exceptional ingredients',
        badge: 'EXCLUSIVE COLLECTION'
      });
      
      // Reload from database
      await Promise.all([fetchOffers(), fetchSettings()]);
      console.log('✅ Force refresh completed');
    } catch (err) {
      console.error('❌ Error during force refresh:', err);
      setError('Failed to refresh exclusive offers data');
    } finally {
      setLoading(false);
    }
  };

  return {
    offers,
    settings,
    loading,
    error,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus,
    updateSettings,
    refetch: () => Promise.all([fetchOffers(), fetchSettings()]),
    forceRefresh
  };
};
