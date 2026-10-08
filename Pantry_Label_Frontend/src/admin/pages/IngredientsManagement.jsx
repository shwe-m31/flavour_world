import React, { useState, useMemo } from 'react';
import { Package, Plus, Edit2, Trash2, Globe, Eye, Check, AlertCircle } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

export const IngredientsManagement = () => {
  const {
    ingredients,
    categories,
    states,
    languages,
    addIngredient,
    updateIngredient,
    deleteIngredient
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewTranslationsModalOpen, setIsViewTranslationsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeIngredient, setActiveIngredient] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    english_name: '',
    category: categories[0]?.name || 'Grains & Rice',
    category_id: 1,
    state: 'Multiple States',
    state_id: null,
    price: 49.00,
    tamil_name: '',
    kannada_name: '',
    malayalam_name: '',
    marathi_name: '',
    bengali_name: '',
    telugu_name: '',
    hindi_name: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // Filter options
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(c => ({ value: c.name, label: c.name }))
  ];

  const stateOptions = [
    { value: 'all', label: 'All States' },
    { value: 'Multiple States', label: 'Multiple States' },
    ...states.map(s => ({ value: s.name, label: s.name }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Disabled', label: 'Disabled' }
  ];

  const filteredIngredients = useMemo(() => {
    return ingredients.filter(item => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.english_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product_code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchState = selectedState === 'all' || item.state === selectedState;
      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;

      return matchSearch && matchCategory && matchState && matchStatus;
    });
  }, [ingredients, searchTerm, selectedCategory, selectedState, selectedStatus]);

  const handleOpenAdd = () => {
    setActiveIngredient(null);
    setFormData(initialFormState);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setActiveIngredient(item);
    setFormData({
      ...item,
      tamil_name: item.tamil_name || '',
      kannada_name: item.kannada_name || '',
      malayalam_name: item.malayalam_name || '',
      marathi_name: item.marathi_name || '',
      bengali_name: item.bengali_name || '',
      telugu_name: item.telugu_name || '',
      hindi_name: item.hindi_name || ''
    });
    setIsAddEditModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (activeIngredient) {
      updateIngredient({ ...activeIngredient, ...formData });
    } else {
      addIngredient(formData);
    }
    setIsAddEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (activeIngredient) {
      deleteIngredient(activeIngredient.id);
      setIsDeleteModalOpen(false);
      setActiveIngredient(null);
    }
  };

  const columns = [
    {
      header: 'Code',
      field: 'product_code',
      sortable: true,
      width: '90px',
      render: (val) => <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600 }}>{val}</span>
    },
    {
      header: 'Ingredient / Item',
      field: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{row.english_name}</div>
        </div>
      )
    },
    {
      header: 'Category',
      field: 'category',
      sortable: true
    },
    {
      header: 'Regional State',
      field: 'state',
      sortable: true,
      render: (val) => val || 'Multiple States'
    },
    {
      header: 'Base Price',
      field: 'price',
      align: 'right',
      sortable: true,
      render: (val) => `₹${Number(val).toFixed(2)}`
    },
    {
      header: 'Languages',
      field: 'available_languages',
      sortable: true,
      render: (val, row) => (
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={() => {
            setActiveIngredient(row);
            setIsViewTranslationsModalOpen(true);
          }}
          title="View Script Translations"
        >
          <Globe size={11} />
          <span>7 Scripts</span>
        </button>
      )
    },
    {
      header: 'Status',
      field: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Last Updated',
      field: 'last_updated',
      sortable: true
    },
    {
      header: 'Actions',
      field: 'id',
      align: 'right',
      render: (val, row) => (
        <div style={{ display: 'inline-flex', gap: 4 }}>
          <button
            type="button"
            className="admin-btn-icon"
            onClick={() => handleOpenEdit(row)}
            title="Edit Ingredient"
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            className="admin-btn-icon"
            onClick={() => {
              setActiveIngredient(row);
              setIsDeleteModalOpen(true);
            }}
            title="Delete Ingredient"
          >
            <Trash2 size={13} style={{ color: 'var(--admin-danger)' }} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-heading">Ingredient Catalogue</h2>
          <p className="admin-page-subtitle">
            Master database of pantry staples, multilingual botanical names, and regional state mapping.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={14} />
            <span>Add Ingredient</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search ingredient name, code, English..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            value: selectedCategory,
            onChange: setSelectedCategory,
            options: categoryOptions
          },
          {
            value: selectedState,
            onChange: setSelectedState,
            options: stateOptions
          },
          {
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: statusOptions
          }
        ]}
        onReset={() => {
          setSearchTerm('');
          setSelectedCategory('all');
          setSelectedState('all');
          setSelectedStatus('all');
        }}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredIngredients}
        pageSize={10}
        keyField="id"
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={activeIngredient ? `Edit Ingredient — ${activeIngredient.product_code}` : 'Add New Pantry Ingredient'}
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setIsAddEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleSave}
            >
              {activeIngredient ? 'Save Changes' : 'Create Ingredient'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Ingredient Primary Name *</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g. Rice (Ponni / Raw)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">English Botanical / Common Name *</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g. Raw Rice"
                value={formData.english_name}
                onChange={(e) => setFormData({ ...formData, english_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Category</label>
              <select
                className="admin-form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Regional State Association</label>
              <select
                className="admin-form-select"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              >
                <option value="Multiple States">Multiple States (All India)</option>
                {states.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Multilingual Vernacular Script Translations */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--admin-border)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--admin-text-primary)' }}>
              Multilingual Script Translations (Database Model)
            </div>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Tamil (தமிழ்)</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="அரிசி"
                  value={formData.tamil_name}
                  onChange={(e) => setFormData({ ...formData, tamil_name: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Kannada (ಕನ್ನಡ)</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="ಅಕ್ಕಿ"
                  value={formData.kannada_name}
                  onChange={(e) => setFormData({ ...formData, kannada_name: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Malayalam (മലയാളം)</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="അരി"
                  value={formData.malayalam_name}
                  onChange={(e) => setFormData({ ...formData, malayalam_name: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Marathi (मराठी)</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="तांदूळ"
                  value={formData.marathi_name}
                  onChange={(e) => setFormData({ ...formData, marathi_name: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Bengali (বাংলা)</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="চাল"
                  value={formData.bengali_name}
                  onChange={(e) => setFormData({ ...formData, bengali_name: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Telugu (తెలుగు)</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="బియ్యం"
                  value={formData.telugu_name}
                  onChange={(e) => setFormData({ ...formData, telugu_name: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Hindi (हिन्दी)</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="चावल"
                  value={formData.hindi_name}
                  onChange={(e) => setFormData({ ...formData, hindi_name: e.target.value })}
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* View Script Translations Matrix Modal */}
      <Modal
        isOpen={isViewTranslationsModalOpen}
        onClose={() => setIsViewTranslationsModalOpen(false)}
        title={`Script Translations — ${activeIngredient?.name} (${activeIngredient?.product_code})`}
        size="md"
        footer={
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setIsViewTranslationsModalOpen(false)}
          >
            Close Matrix
          </button>
        }
      >
        {activeIngredient && (
          <div>
            <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--admin-text-secondary)' }}>
              Category: <strong>{activeIngredient.category}</strong> • State: <strong>{activeIngredient.state}</strong>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Language</th>
                  <th>Script Code</th>
                  <th>Rendered Translation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tamil (தமிழ்)</td>
                  <td><code>ta</code></td>
                  <td><strong style={{ fontSize: 14 }}>{activeIngredient.tamil_name || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Kannada (ಕನ್ನಡ)</td>
                  <td><code>kn</code></td>
                  <td><strong style={{ fontSize: 14 }}>{activeIngredient.kannada_name || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Malayalam (മലയാളം)</td>
                  <td><code>ml</code></td>
                  <td><strong style={{ fontSize: 14 }}>{activeIngredient.malayalam_name || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Marathi (मराठी)</td>
                  <td><code>mr</code></td>
                  <td><strong style={{ fontSize: 14 }}>{activeIngredient.marathi_name || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Bengali (বাংলা)</td>
                  <td><code>bn</code></td>
                  <td><strong style={{ fontSize: 14 }}>{activeIngredient.bengali_name || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Telugu (తెలుగు)</td>
                  <td><code>te</code></td>
                  <td><strong style={{ fontSize: 14 }}>{activeIngredient.telugu_name || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Hindi (हिन्दी)</td>
                  <td><code>hi</code></td>
                  <td><strong style={{ fontSize: 14 }}>{activeIngredient.hindi_name || '—'}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Ingredient Deletion"
        size="md"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={handleDeleteConfirm}
            >
              Confirm Delete
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <AlertCircle size={20} style={{ color: 'var(--admin-danger)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--admin-text-primary)' }}>
              Are you sure you want to remove "{activeIngredient?.name}" ({activeIngredient?.product_code})?
            </div>
            <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)', marginTop: 4 }}>
              This will remove the item from all multilingual label generation pools. Existing order archives will maintain their generated snapshot.
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default IngredientsManagement;
