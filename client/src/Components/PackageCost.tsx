// src/components/PackageCost.tsx
import React, { useState } from 'react';
import { getPackageCost } from '../api';

const PackageCost: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [cost, setCost] = useState<any>(null);
  const [includeDependencies, setIncludeDependencies] = useState<boolean>(false);

  const fetchCost = async () => {
    try {
      const result = await getPackageCost(id, includeDependencies);
      setCost(result);
    } catch (error) {
      console.error("Failed to fetch package cost", error);
    }
  };

  return (
    <div className="container">
      <h2>Get Package Cost</h2>
      <input
        type="text"
        className="form-control my-3"
        placeholder="Enter Package ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="includeDependencies"
          checked={includeDependencies}
          onChange={(e) => setIncludeDependencies(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="includeDependencies">Include Dependencies</label>
      </div>
      <button onClick={fetchCost} className="btn btn-info mb-3">Fetch Cost</button>
      {cost && <pre className="bg-light p-3 rounded">{JSON.stringify(cost, null, 2)}</pre>}
    </div>
  );
};

export default PackageCost;
    