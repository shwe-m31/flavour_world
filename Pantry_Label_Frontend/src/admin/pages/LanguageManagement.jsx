import React, { useState } from 'react';
import { Globe, Plus, Edit2, Search, Save } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

export const LanguageManagement = () => {
  const {
    languages,
    ingredients,
    toggleLanguageStatus,
    addLanguage,
    updateTranslation
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('languages'); // 'languages' or 'matrix'
  const [isAddLanguageModalOpen, setIsAddLanguageModalOpen] = useState(false);
  const [matrixSearch, setMatrixSearch] = useState('');

  // Form State
  const [newLangName, setNewLangName] = useState('');
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangNative, setNewLangNative] = useState('');

  // Inline translation editing state: { productId, key, value }
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddLanguage = (e) => {
    e.preventDefault();
    if (!newLangName || !newLangCode) return;

    addLanguage({
      name: newLangName,
      code: newLangCode.toLowerCase(),
      nativeName: newLangNative || newLangName
    });

    setNewLangName('');
    setNewLangCode('');
    setNewLangNative('');
    setIsAddLanguageModalOpen(false);
  };

  const handleStartEdit = (productId, langKey, currentValue) => {
    setEditingCell({ productId, langKey });
    setEditValue(currentValue || '');
  };

  const handleSaveInlineTranslation = (productId, langKey) => {
    updateTranslation(productId, langKey, editValue);
    setEditingCell(null);
  };

  const languageColumns = [
    {
      header: 'Language',
      field: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <strong style={{ fontSize: 13 }}>{val}</strong>
          <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--admin-text-muted)' }}>
            ({row.nativeName})
          </span>
        </div>
      )
    },
    {
      header: 'ISO Code',
      field: 'code',
      sortable: true,
      render: (val) => <code style={{ fontSize: 11, background: 'var(--admin-surface-gray)', padding: '2px 6px', border: '1px solid var(--admin-border)', borderRadius: 3 }}>{val}</code>
    },
    {
      header: 'Status',
      field: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Translation Coverage',
      field: 'coverage',
      sortable: true,
      render: (val) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{val}</span>
      )
    },
    {
      header: 'Products Available',
      field: 'productsCount',
      align: 'right',
      sortable: true,
      render: (val) => `${val} items`
    },
    {
      header: 'Last Updated',
      field: 'lastUpdated',
      sortable: true
    },
    {
      header: 'Actions',
      field: 'id',
      align: 'right',
      render: (val, row) => (
        <div style={{ display: 'inline-flex', gap: 6 }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => setActiveTab('matrix')}
          >
            Manage Matrix
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${row.status === 'Active' ? 'admin-btn-secondary' : 'admin-btn-primary'}`}
            onClick={() => toggleLanguageStatus(row.id)}
          >
            {row.status === 'Active' ? 'Disable' : 'Enable'}
          </button>
        </div>
      )
    }
  ];

  const filteredMatrixIngredients = ingredients.filter(i =>
    i.name.toLowerCase().includes(matrixSearch.toLowerCase()) ||
    i.english_name.toLowerCase().includes(matrixSearch.toLowerCase()) ||
    i.product_code.toLowerCase().includes(matrixSearch.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-heading">Language & Translation Management</h2>
          <p className="admin-page-subtitle">
            Database-driven multilingual dictionary across Indian regional languages and scripts.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => setIsAddLanguageModalOpen(true)}
          >
            <Plus size={14} />
            <span>+ Add Language</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--admin-border)', paddingBottom: 8 }}>
        <button
          type="button"
          className={`admin-btn ${activeTab === 'languages' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('languages')}
        >
          <Globe size={13} />
          <span>Language Registry ({languages.length})</span>
        </button>
        <button
          type="button"
          className={`admin-btn ${activeTab === 'matrix' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('matrix')}
        >
          <Edit2 size={13} />
          <span>Database Translation Matrix</span>
        </button>
      </div>

      {activeTab === 'languages' ? (
        <DataTable
          columns={languageColumns}
          data={languages}
          pageSize={10}
          keyField="id"
        />
      ) : (
        /* Translation Matrix Tab */
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ position: 'relative', width: 280 }}>
              <input
                type="text"
                className="admin-filter-input"
                style={{ width: '100%', paddingLeft: 28 }}
                placeholder="Search ingredient..."
                value={matrixSearch}
                onChange={(e) => setMatrixSearch(e.target.value)}
              />
              <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>
              Click any cell below to edit live database translation
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Code</th>
                  <th>English Name</th>
                  <th>Tamil (தமிழ்)</th>
                  <th>Kannada (ಕನ್ನಡ)</th>
                  <th>Malayalam (മലയാളം)</th>
                  <th>Marathi (मराठी)</th>
                  <th>Bengali (বাংলা)</th>
                  <th>Telugu (తెలుగు)</th>
                  <th>Hindi (हिन्दी)</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatrixIngredients.map(ing => (
                  <tr key={ing.id}>
                    <td><code>{ing.product_code}</code></td>
                    <td><strong>{ing.name}</strong></td>

                    {/* Tamil */}
                    <td>
                      {editingCell?.productId === ing.id && editingCell?.langKey === 'tamil_name' ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <input
                            type="text"
                            className="admin-form-input"
                            style={{ padding: '2px 6px', height: 24, fontSize: 12 }}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => handleSaveInlineTranslation(ing.id, 'tamil_name')}
                          >
                            <Save size={10} />
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => handleStartEdit(ing.id, 'tamil_name', ing.tamil_name)}
                          style={{ cursor: 'pointer', borderBottom: '1px dotted var(--admin-border-strong)' }}
                          title="Click to edit"
                        >
                          {ing.tamil_name || '—'}
                        </span>
                      )}
                    </td>

                    {/* Kannada */}
                    <td>
                      {editingCell?.productId === ing.id && editingCell?.langKey === 'kannada_name' ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <input
                            type="text"
                            className="admin-form-input"
                            style={{ padding: '2px 6px', height: 24, fontSize: 12 }}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => handleSaveInlineTranslation(ing.id, 'kannada_name')}
                          >
                            <Save size={10} />
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => handleStartEdit(ing.id, 'kannada_name', ing.kannada_name)}
                          style={{ cursor: 'pointer', borderBottom: '1px dotted var(--admin-border-strong)' }}
                          title="Click to edit"
                        >
                          {ing.kannada_name || '—'}
                        </span>
                      )}
                    </td>

                    {/* Malayalam */}
                    <td>
                      {editingCell?.productId === ing.id && editingCell?.langKey === 'malayalam_name' ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <input
                            type="text"
                            className="admin-form-input"
                            style={{ padding: '2px 6px', height: 24, fontSize: 12 }}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => handleSaveInlineTranslation(ing.id, 'malayalam_name')}
                          >
                            <Save size={10} />
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => handleStartEdit(ing.id, 'malayalam_name', ing.malayalam_name)}
                          style={{ cursor: 'pointer', borderBottom: '1px dotted var(--admin-border-strong)' }}
                          title="Click to edit"
                        >
                          {ing.malayalam_name || '—'}
                        </span>
                      )}
                    </td>

                    {/* Marathi */}
                    <td>
                      {editingCell?.productId === ing.id && editingCell?.langKey === 'marathi_name' ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <input
                            type="text"
                            className="admin-form-input"
                            style={{ padding: '2px 6px', height: 24, fontSize: 12 }}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => handleSaveInlineTranslation(ing.id, 'marathi_name')}
                          >
                            <Save size={10} />
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => handleStartEdit(ing.id, 'marathi_name', ing.marathi_name)}
                          style={{ cursor: 'pointer', borderBottom: '1px dotted var(--admin-border-strong)' }}
                          title="Click to edit"
                        >
                          {ing.marathi_name || '—'}
                        </span>
                      )}
                    </td>

                    {/* Bengali */}
                    <td>
                      {editingCell?.productId === ing.id && editingCell?.langKey === 'bengali_name' ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <input
                            type="text"
                            className="admin-form-input"
                            style={{ padding: '2px 6px', height: 24, fontSize: 12 }}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => handleSaveInlineTranslation(ing.id, 'bengali_name')}
                          >
                            <Save size={10} />
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => handleStartEdit(ing.id, 'bengali_name', ing.bengali_name)}
                          style={{ cursor: 'pointer', borderBottom: '1px dotted var(--admin-border-strong)' }}
                          title="Click to edit"
                        >
                          {ing.bengali_name || '—'}
                        </span>
                      )}
                    </td>

                    {/* Telugu */}
                    <td>
                      {editingCell?.productId === ing.id && editingCell?.langKey === 'telugu_name' ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <input
                            type="text"
                            className="admin-form-input"
                            style={{ padding: '2px 6px', height: 24, fontSize: 12 }}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => handleSaveInlineTranslation(ing.id, 'telugu_name')}
                          >
                            <Save size={10} />
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => handleStartEdit(ing.id, 'telugu_name', ing.telugu_name)}
                          style={{ cursor: 'pointer', borderBottom: '1px dotted var(--admin-border-strong)' }}
                          title="Click to edit"
                        >
                          {ing.telugu_name || '—'}
                        </span>
                      )}
                    </td>

                    {/* Hindi */}
                    <td>
                      {editingCell?.productId === ing.id && editingCell?.langKey === 'hindi_name' ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <input
                            type="text"
                            className="admin-form-input"
                            style={{ padding: '2px 6px', height: 24, fontSize: 12 }}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => handleSaveInlineTranslation(ing.id, 'hindi_name')}
                          >
                            <Save size={10} />
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => handleStartEdit(ing.id, 'hindi_name', ing.hindi_name)}
                          style={{ cursor: 'pointer', borderBottom: '1px dotted var(--admin-border-strong)' }}
                          title="Click to edit"
                        >
                          {ing.hindi_name || '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Language Modal */}
      <Modal
        isOpen={isAddLanguageModalOpen}
        onClose={() => setIsAddLanguageModalOpen(false)}
        title="Register New Language"
        size="md"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setIsAddLanguageModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleAddLanguage}
            >
              Add Language
            </button>
          </>
        }
      >
        <form onSubmit={handleAddLanguage}>
          <div className="admin-form-group">
            <label className="admin-form-label">Language Name (English) *</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="e.g. Gujarati"
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">ISO 639-1 Language Code *</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="e.g. gu"
              maxLength={4}
              value={newLangCode}
              onChange={(e) => setNewLangCode(e.target.value)}
              required
            />
            <div className="admin-form-helper">Two-letter standard language code.</div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Native Script / Autonym</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="e.g. ગુજરાતી"
              value={newLangNative}
              onChange={(e) => setNewLangNative(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LanguageManagement;
