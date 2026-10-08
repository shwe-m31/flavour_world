import React, { useState, useMemo } from 'react';
import { Lightbulb } from 'lucide-react';
import { useAdmin } from '../data/AdminContext';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import KpiCard from '../components/KpiCard';

export const RecommendationsManagement = () => {
  const { recommendations } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResult, setSelectedResult] = useState('all');

  const resultOptions = [
    { value: 'all', label: 'All Results' },
    { value: 'Added to Cart', label: 'Added to Cart' },
    { value: 'Viewed', label: 'Viewed' },
    { value: 'Ignored', label: 'Ignored' }
  ];

  const filteredRecs = useMemo(() => {
    return recommendations.filter(r => {
      const matchSearch =
        r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.selected_ingredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.recommended_product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.recommendation_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchResult = selectedResult === 'all' || r.result === selectedResult;

      return matchSearch && matchResult;
    });
  }, [recommendations, searchTerm, selectedResult]);

  const columns = [
    {
      header: 'Customer',
      field: 'customer',
      sortable: true,
      render: (val) => <strong>{val}</strong>
    },
    {
      header: 'Selected Ingredient (Trigger)',
      field: 'selected_ingredient',
      sortable: true
    },
    {
      header: 'Recommended Product',
      field: 'recommended_product',
      sortable: true,
      render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
    },
    {
      header: 'Recommendation Rule / Type',
      field: 'recommendation_type',
      sortable: true
    },
    {
      header: 'Date',
      field: 'date',
      sortable: true
    },
    {
      header: 'Customer Action',
      field: 'result',
      render: (val) => (
        <span
          className={`admin-badge ${
            val === 'Added to Cart'
              ? 'admin-badge-success'
              : val === 'Viewed'
              ? 'admin-badge-info'
              : 'admin-badge-neutral'
          }`}
        >
          <span className="admin-badge-dot" />
          {val}
        </span>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-heading">Recommendation Activity</h2>
          <p className="admin-page-subtitle">
            Rule-based pantry item pairing engine, complementary staple recommendations, and cart conversion logs.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <KpiCard
          label="Total Suggestions Served"
          value="1,842"
          context="3.1 per session"
          icon={Lightbulb}
        />
        <KpiCard
          label="Cart Add Conversion"
          value="48.2%"
          trend="+5.4%"
          trendType="positive"
          context="high-intent pairing"
        />
        <KpiCard
          label="Top Complementary Pair"
          value="Mustard → Cumin"
          context="Tadka blend staple"
        />
        <KpiCard
          label="Revenue Uplift"
          value="₹38,400"
          trend="+16.4%"
          trendType="positive"
          context="from suggested items"
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search customer, trigger ingredient, suggested product..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            value: selectedResult,
            onChange: setSelectedResult,
            options: resultOptions
          }
        ]}
        onReset={() => {
          setSearchTerm('');
          setSelectedResult('all');
        }}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredRecs}
        pageSize={8}
        keyField="id"
      />
    </div>
  );
};

export default RecommendationsManagement;
