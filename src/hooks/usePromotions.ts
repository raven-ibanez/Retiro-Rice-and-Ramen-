import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  gradient_colors: string;
  badge_text: string;
  promo_code: string;
  valid_until: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PromotionSettings {
  promotions_enabled: boolean;
  promotion_auto_rotate: boolean;
  promotion_rotation_speed: number;
  promotion_max_display: number;
}

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [settings, setSettings] = useState<PromotionSettings>({
    promotions_enabled: true,
    promotion_auto_rotate: true,
    promotion_rotation_speed: 5000,
    promotion_max_display: 4
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch active promotions ordered by sort_order
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('promotions')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (promotionsError) throw promotionsError;

      // Fetch promotion settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('id, value')
        .in('id', [
          'promotions_enabled',
          'promotion_auto_rotate', 
          'promotion_rotation_speed',
          'promotion_max_display'
        ]);

      if (settingsError) throw settingsError;

      // Parse settings
      const parsedSettings: PromotionSettings = {
        promotions_enabled: settingsData.find(s => s.id === 'promotions_enabled')?.value === 'true',
        promotion_auto_rotate: settingsData.find(s => s.id === 'promotion_auto_rotate')?.value === 'true',
        promotion_rotation_speed: parseInt(settingsData.find(s => s.id === 'promotion_rotation_speed')?.value || '5000'),
        promotion_max_display: parseInt(settingsData.find(s => s.id === 'promotion_max_display')?.value || '4')
      };

      setPromotions(promotionsData || []);
      setSettings(parsedSettings);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch promotions');
      
      // Fallback to static promotions if database fails
      setPromotions([
        {
          id: 'fallback-1',
          title: '20% OFF',
          subtitle: 'Premium Ramen Bowls & Tonkatsu',
          description: 'Get 20% OFF on All Premium Ramen Bowls & Tonkatsu Specials',
          image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&h=600&fit=crop&crop=center',
          gradient_colors: 'from-retiro-red to-retiro-kimchi',
          badge_text: '🔥 LIMITED TIME',
          promo_code: 'RETIRO20',
          valid_until: 'Dec 31, 2024',
          active: true,
          sort_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createPromotion = async (promotion: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .insert([promotion])
        .select()
        .single();

      if (error) throw error;

      await fetchPromotions(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error creating promotion:', err);
      throw err;
    }
  };

  const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchPromotions(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error updating promotion:', err);
      throw err;
    }
  };

  const deletePromotion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPromotions(); // Refresh the list
    } catch (err) {
      console.error('Error deleting promotion:', err);
      throw err;
    }
  };

  const togglePromotionStatus = async (id: string) => {
    try {
      const promotion = promotions.find(p => p.id === id);
      if (!promotion) throw new Error('Promotion not found');

      return await updatePromotion(id, { active: !promotion.active });
    } catch (err) {
      console.error('Error toggling promotion status:', err);
      throw err;
    }
  };

  const updatePromotionSettings = async (newSettings: Partial<PromotionSettings>) => {
    try {
      const updates = Object.entries(newSettings).map(([key, value]) => ({
        id: key,
        value: value.toString(),
        type: typeof value === 'boolean' ? 'boolean' : 'number',
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates);

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (err) {
      console.error('Error updating promotion settings:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return {
    promotions: promotions.slice(0, settings.promotion_max_display),
    settings,
    loading,
    error,
    createPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotionStatus,
    updatePromotionSettings,
    refreshPromotions: fetchPromotions
  };
};
