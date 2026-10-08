import React, { useState, useMemo } from 'react';
import { Tag, Eye, Layers, Type, Sparkles } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import LabelPreviewModal from '../components/LabelPreviewModal';
import KpiCard from '../components/KpiCard';
import { ClinicalDistributionBar } from '../components/ClinicalChart';

export const LabelActivity = () => {
  const { labelActivities } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShape, setSelectedShape] = useState('all');
  const [selectedFont, setSelectedFont] = useState('all');
  const [selectedBg, setSelectedBg] = useState('all');
  const [selectedLabelForPreview, setSelectedLabelForPreview] = useState(null);

  const shapeOptions = [
    { value: 'all', label: 'All Shapes' },
    { value: 'Square', label: 'Square' },
    { value: 'Rounded', label: 'Rounded' },
    { value: 'Circle', label: 'Circle' },
    { value: 'Oval', label: 'Oval' }
  ];

  const fontOptions = [
    { value: 'all', label: 'All Fonts' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Roboto', label: 'Roboto' }
  ];

  const bgOptions = [
    { value: 'all', label: 'All Backgrounds' },
    { value: 'White', label: 'White' },
    { value: 'Kraft', label: 'Kraft' },
    { value: 'Minimal', label: 'Minimal' },
    { value: 'Transparent', label: 'Transparent' }
  ];

  const filteredLabels = useMemo(() => {
    return labelActivities.filter(item => {
      const matchSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.language.toLowerCase().includes(searchTerm.toLowerCase());
      const matchShape = selectedShape === 'all' || item.shape === selectedShape;
      const matchFont = selectedFont === 'all' || item.font === selectedFont;
      const matchBg = selectedBg === 'all' || item.background === selectedBg;

      return matchSearch && matchShape && matchFont && matchBg;
    });
  }, [labelActivities, searchTerm, selectedShape, selectedFont, selectedBg]);

  const shapeShareData = [
    { label: 'Square', value: 48, count: '1,844 labels', color: '#202124' },
    { label: 'Rounded', value: 26, count: '998 labels', color: '#4267A9' },
    { label: 'Circle', value: 16, count: '614 labels', color: '#238B5A' },
    { label: 'Oval', value: 10, count: '386 labels', color: '#B7791F' }
  ];

  const fontShareData = [
    { label: 'Inter (Modern Sans)', value: 52, count: '1,997 orders', color: '#202124' },
    { label: 'Montserrat (Geometric)', value: 24, count: '922 orders', color: '#5F6368' },
    { label: 'Playfair Display (Serif)', value: 14, count: '537 orders', color: '#8A8F94' },
    { label: 'Roboto (Clean)', value: 10, count: '386 orders', color: '#A5A9AD' }
  ];

  const columns = [
    {
      header: 'Label Batch ID',
      field: 'id',
      sortable: true,
      width: '120px',
      render: (val) => <strong>{val}</strong>
    },
    {
      header: 'Order Ref',
      field: 'order_id',
      sortable: true,
      render: (val) => <span style={{ fontFamily: 'monospace' }}>{val}</span>
    },
    {
      header: 'Customer',
      field: 'customer',
      sortable: true
    },
    {
      header: 'Items in Set',
      field: 'ingredient_count',
      align: 'right',
      sortable: true,
      render: (val) => `${val} labels`
    },
    {
      header: 'Language Pairing',
      field: 'language',
      sortable: true
    },
    {
      header: 'Shape',
      field: 'shape',
      sortable: true
    },
    {
      header: 'Font Typography',
      field: 'font',
      sortable: true
    },
    {
      header: 'Material / Bg',
      field: 'background',
      sortable: true
    },
    {
      header: 'Generated Date',
      field: 'generated_date',
      sortable: true
    },
    {
      header: 'Status',
      field: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      header: 'Action',
      field: 'id',
      align: 'right',
      render: (val, row) => (
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={() => setSelectedLabelForPreview(row)}
        >
          <Eye size={12} />
          <span>Inspect</span>
        </button>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-heading">Label Generation & Customization</h2>
          <p className="admin-page-subtitle">
            Customer label batch rendering, layout typography metrics, and aesthetic preferences.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <KpiCard
          label="Generated Today"
          value="248"
          trend="+18%"
          trendType="positive"
          context="active print queues"
        />
        <KpiCard
          label="Generated This Week"
          value="1,420"
          trend="+12.2%"
          trendType="positive"
          context="7 day aggregate"
        />
        <KpiCard
          label="Avg Labels / Order"
          value="22.4"
          context="healthy cart density"
        />
        <KpiCard
          label="Top Customization"
          value="Square • Inter"
          context="White Waterproof Vinyl"
        />
      </div>

      {/* Customization Share Charts */}
      <div className="admin-grid-2" style={{ marginBottom: 20 }}>
        <ClinicalDistributionBar
          title="Label Shape Selection Distribution"
          items={shapeShareData}
        />
        <ClinicalDistributionBar
          title="Typography Font Preference Distribution"
          items={fontShareData}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by Label ID, Order ID, Customer, Language..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            value: selectedShape,
            onChange: setSelectedShape,
            options: shapeOptions
          },
          {
            value: selectedFont,
            onChange: setSelectedFont,
            options: fontOptions
          },
          {
            value: selectedBg,
            onChange: setSelectedBg,
            options: bgOptions
          }
        ]}
        onReset={() => {
          setSearchTerm('');
          setSelectedShape('all');
          setSelectedFont('all');
          setSelectedBg('all');
        }}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLabels}
        pageSize={8}
        keyField="id"
      />

      {/* Live Label Preview Modal */}
      <LabelPreviewModal
        isOpen={Boolean(selectedLabelForPreview)}
        onClose={() => setSelectedLabelForPreview(null)}
        labelData={selectedLabelForPreview}
      />
    </div>
  );
};

export default LabelActivity;
