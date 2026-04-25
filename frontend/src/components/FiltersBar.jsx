export default function FiltersBar({ filters, setFilters, categories }) {
  function updateField(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="form-grid">
      <label>
        Search
        <input value={filters.keyword} onChange={(event) => updateField("keyword", event.target.value)} />
      </label>
      <label>
        Category
        <select value={filters.category} onChange={(event) => updateField("category", event.target.value)}>
          <option value="">All</option>
          {categories.map((item) => (
            <option key={`${item.type}-${item.name}`} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Start Date
        <input type="date" value={filters.startDate} onChange={(event) => updateField("startDate", event.target.value)} />
      </label>
      <label>
        End Date
        <input type="date" value={filters.endDate} onChange={(event) => updateField("endDate", event.target.value)} />
      </label>
      <label>
        Min Amount
        <input value={filters.minAmount} onChange={(event) => updateField("minAmount", event.target.value)} />
      </label>
      <label>
        Max Amount
        <input value={filters.maxAmount} onChange={(event) => updateField("maxAmount", event.target.value)} />
      </label>
    </div>
  );
}
