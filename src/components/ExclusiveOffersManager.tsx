import React, { useState } from 'react';
import { useExclusiveOffers, ExclusiveOffer, ExclusiveOffersSettings } from '../hooks/useExclusiveOffers';
import { X, Plus, Edit, Trash2, Eye, EyeOff, Save, RotateCcw, Settings } from 'lucide-react';

const ExclusiveOffersManager: React.FC = () => {
  const {
    offers,
    settings,
    loading,
    error,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus,
    updateSettings,
    refetch,
    forceRefresh
  } = useExclusiveOffers();

  const [editingOffer, setEditingOffer] = useState<ExclusiveOffer | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 0,
    original_price: 0,
    discount_text: '',
    image_url: '',
    badge_text: '',
    display_order: 0
  });
  const [settingsData, setSettingsData] = useState<Partial<ExclusiveOffersSettings>>({});

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      price: 0,
      original_price: 0,
      discount_text: '',
      image_url: '',
      badge_text: '',
      display_order: 0
    });
    setEditingOffer(null);
    setIsCreating(false);
  };

  const handleEdit = (offer: ExclusiveOffer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      subtitle: offer.subtitle || '',
      description: offer.description || '',
      price: offer.price,
      original_price: offer.original_price,
      discount_text: offer.discount_text || '',
      image_url: offer.image_url || '',
      badge_text: offer.badge_text || '',
      display_order: offer.display_order
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await updateOffer(editingOffer.id, formData);
        setEditingOffer(null);
      } else {
        await createOffer({
          ...formData,
          available: true
        });
      }
      resetForm();
    } catch (err) {
      console.error('Error saving offer:', err);
      alert(`Failed to save offer: ${err.message || err}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this exclusive offer?')) {
      try {
        await deleteOffer(id);
      } catch (err) {
        console.error('Error deleting offer:', err);
        alert(`Failed to delete offer: ${err.message || err}`);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleOfferStatus(id);
    } catch (err) {
      console.error('Error toggling offer status:', err);
      alert('Failed to toggle offer status. Please try again.');
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(settingsData);
      setSettingsData({});
      setShowSettings(false);
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-retiro-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exclusive offers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800">{error}</p>
        <button
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Exclusive Offers Management</h2>
          <p className="text-gray-600">Manage your premium exclusive offers and settings</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={forceRefresh}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center px-4 py-2 bg-retiro-red text-white rounded-lg hover:bg-retiro-kimchi transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Offer
          </button>
        </div>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Exclusive Offers ({offers.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {offers.map((offer) => (
            <div key={offer.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                    {offer.image_url ? (
                      <img
                        src={offer.image_url}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{offer.title}</h4>
                    <p className="text-sm text-gray-600">{offer.subtitle}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm font-medium text-retiro-red">
                        ₱{offer.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₱{offer.original_price.toLocaleString()}
                      </span>
                      <span className="text-xs bg-retiro-red text-white px-2 py-1 rounded">
                        {offer.badge_text}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        offer.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {offer.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleStatus(offer.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      offer.available 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-red-600 hover:bg-red-100'
                    }`}
                    title={offer.available ? 'Mark as unavailable' : 'Mark as available'}
                  >
                    {offer.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(offer)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit offer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete offer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {offers.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              <p>No exclusive offers found. Create your first offer to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {(isCreating || editingOffer) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingOffer ? 'Edit Exclusive Offer' : 'Create New Exclusive Offer'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Text
                  </label>
                  <input
                    type="text"
                    value={formData.discount_text}
                    onChange={(e) => setFormData({ ...formData, discount_text: e.target.value })}
                    placeholder="e.g., 30% OFF"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.badge_text}
                    onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                    placeholder="e.g., EXCLUSIVE"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-retiro-red text-white rounded-lg hover:bg-retiro-kimchi transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Exclusive Offers Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSettingsSubmit} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Enable Exclusive Offers
                </label>
                <input
                  type="checkbox"
                  checked={settingsData.enabled ?? settings.enabled}
                  onChange={(e) => setSettingsData({ ...settingsData, enabled: e.target.checked })}
                  className="h-4 w-4 text-retiro-red focus:ring-retiro-red border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Auto Rotate
                </label>
                <input
                  type="checkbox"
                  checked={settingsData.auto_rotate ?? settings.auto_rotate}
                  onChange={(e) => setSettingsData({ ...settingsData, auto_rotate: e.target.checked })}
                  className="h-4 w-4 text-retiro-red focus:ring-retiro-red border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rotation Speed (milliseconds)
                </label>
                <input
                  type="number"
                  value={settingsData.rotation_speed ?? settings.rotation_speed}
                  onChange={(e) => setSettingsData({ ...settingsData, rotation_speed: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={settingsData.title ?? settings.title}
                  onChange={(e) => setSettingsData({ ...settingsData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Subtitle
                </label>
                <textarea
                  value={settingsData.subtitle ?? settings.subtitle}
                  onChange={(e) => setSettingsData({ ...settingsData, subtitle: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={settingsData.badge ?? settings.badge}
                  onChange={(e) => setSettingsData({ ...settingsData, badge: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-retiro-red text-white rounded-lg hover:bg-retiro-kimchi transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExclusiveOffersManager;
