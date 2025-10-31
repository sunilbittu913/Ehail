/**
 * Example Usage of Aboosto Configuration Service API Hooks
 * This file demonstrates various use cases and patterns
 */

import React, { useState } from 'react';
import {
  useCountries,
  useCountry,
  useCreateCountry,
  useUpdateCountry,
  useDeleteCountry,
  useStates,
  useState as useStateData,
  useCreateState,
  useCities,
  useCity,
  useCreateCity,
  CountryMasterDTO,
  StateMasterDTO,
  CityMasterDTO,
} from './index';

// ============================================================================
// Example 1: Simple Country List with Pagination
// ============================================================================

export function CountryListExample() {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, loading, error, refetch } = useCountries({
    page,
    size: pageSize,
  });

  if (loading) return <div>Loading countries...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>Countries</h2>
      <button onClick={() => refetch()}>Refresh</button>
      
      <ul>
        {data.content.map((country) => (
          <li key={country.countryId}>
            {country.countryName} ({country.code})
          </li>
        ))}
      </ul>

      <div>
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={data.first}
        >
          Previous
        </button>
        <span>
          Page {data.number + 1} of {data.totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={data.last}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Example 2: Searchable Country List
// ============================================================================

export function SearchableCountryList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const { data, loading } = useCountries({
    search,
    page,
    size: 10,
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search countries..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0); // Reset to first page on search
        }}
      />

      {loading && <div>Searching...</div>}

      {data && (
        <ul>
          {data.content.map((country) => (
            <li key={country.countryId}>{country.countryName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================================
// Example 3: Create Country Form
// ============================================================================

export function CreateCountryForm() {
  const [formData, setFormData] = useState<CountryMasterDTO>({
    code: '',
    countryName: '',
    status: 'ACTIVE',
  });

  const { mutate, loading, error, reset } = useCreateCountry({
    onSuccess: (response) => {
      alert(`Country created: ${response.data?.countryName}`);
      // Reset form
      setFormData({ code: '', countryName: '', status: 'ACTIVE' });
      reset();
    },
    onError: (error) => {
      alert(`Failed to create country: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Country</h2>

      <div>
        <label>Country Code:</label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Country Name:</label>
        <input
          type="text"
          value={formData.countryName}
          onChange={(e) =>
            setFormData({ ...formData, countryName: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label>Status:</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Country'}
      </button>

      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </form>
  );
}

// ============================================================================
// Example 4: Edit Country Form
// ============================================================================

export function EditCountryForm({ countryId }: { countryId: number }) {
  const { data: country, loading: loadingCountry } = useCountry(countryId);
  const [formData, setFormData] = useState<CountryMasterDTO>({});

  const { mutate, loading: updating } = useUpdateCountry({
    onSuccess: () => {
      alert('Country updated successfully!');
    },
  });

  // Initialize form when country data loads
  React.useEffect(() => {
    if (country) {
      setFormData({
        countryName: country.countryName,
        code: country.code,
        status: country.status,
      });
    }
  }, [country]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutate({ id: countryId, data: formData });
  };

  if (loadingCountry) return <div>Loading country...</div>;
  if (!country) return <div>Country not found</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Country: {country.countryName}</h2>

      <div>
        <label>Country Code:</label>
        <input
          type="text"
          value={formData.code || ''}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        />
      </div>

      <div>
        <label>Country Name:</label>
        <input
          type="text"
          value={formData.countryName || ''}
          onChange={(e) =>
            setFormData({ ...formData, countryName: e.target.value })
          }
        />
      </div>

      <button type="submit" disabled={updating}>
        {updating ? 'Updating...' : 'Update Country'}
      </button>
    </form>
  );
}

// ============================================================================
// Example 5: Delete Country with Confirmation
// ============================================================================

export function DeleteCountryButton({ countryId }: { countryId: number }) {
  const { mutate, loading } = useDeleteCountry({
    onSuccess: () => {
      alert('Country deleted successfully!');
      // Optionally redirect or refresh list
    },
    onError: (error) => {
      alert(`Failed to delete: ${error.message}`);
    },
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      await mutate(countryId);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{ backgroundColor: 'red', color: 'white' }}
    >
      {loading ? 'Deleting...' : 'Delete Country'}
    </button>
  );
}

// ============================================================================
// Example 6: Cascading Dropdowns (Country -> State -> City)
// ============================================================================

export function CascadingLocationSelector() {
  const [selectedCountry, setSelectedCountry] = useState<number>();
  const [selectedState, setSelectedState] = useState<number>();
  const [selectedCity, setSelectedCity] = useState<number>();

  const { data: countries } = useCountries({ size: 100 });
  const { data: states } = useStates({ size: 100 });
  const { data: cities } = useCities({ size: 100 });

  // Filter states by selected country
  const filteredStates = states?.content.filter(
    (state) => state.country?.countryId === selectedCountry
  );

  // Filter cities by selected state
  const filteredCities = cities?.content.filter(
    (city) => city.state?.stateId === selectedState
  );

  return (
    <div>
      <h2>Select Location</h2>

      <div>
        <label>Country:</label>
        <select
          value={selectedCountry || ''}
          onChange={(e) => {
            setSelectedCountry(Number(e.target.value));
            setSelectedState(undefined);
            setSelectedCity(undefined);
          }}
        >
          <option value="">Select a country</option>
          {countries?.content.map((country) => (
            <option key={country.countryId} value={country.countryId}>
              {country.countryName}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && (
        <div>
          <label>State:</label>
          <select
            value={selectedState || ''}
            onChange={(e) => {
              setSelectedState(Number(e.target.value));
              setSelectedCity(undefined);
            }}
          >
            <option value="">Select a state</option>
            {filteredStates?.map((state) => (
              <option key={state.stateId} value={state.stateId}>
                {state.stateName}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedState && (
        <div>
          <label>City:</label>
          <select
            value={selectedCity || ''}
            onChange={(e) => setSelectedCity(Number(e.target.value))}
          >
            <option value="">Select a city</option>
            {filteredCities?.map((city) => (
              <option key={city.cityId} value={city.cityId}>
                {city.cityName}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedCity && (
        <div>
          <h3>Selected Location:</h3>
          <p>
            Country ID: {selectedCountry}, State ID: {selectedState}, City ID:{' '}
            {selectedCity}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 7: Create State with Country Selection
// ============================================================================

export function CreateStateForm() {
  const [formData, setFormData] = useState<StateMasterDTO>({
    code: '',
    stateName: '',
    status: 'ACTIVE',
  });
  const [selectedCountryId, setSelectedCountryId] = useState<number>();

  const { data: countries } = useCountries({ size: 100 });
  const { mutate, loading } = useCreateState({
    onSuccess: () => {
      alert('State created successfully!');
      setFormData({ code: '', stateName: '', status: 'ACTIVE' });
      setSelectedCountryId(undefined);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const country = countries?.content.find(
      (c) => c.countryId === selectedCountryId
    );

    await mutate({
      ...formData,
      country,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New State</h2>

      <div>
        <label>Country:</label>
        <select
          value={selectedCountryId || ''}
          onChange={(e) => setSelectedCountryId(Number(e.target.value))}
          required
        >
          <option value="">Select a country</option>
          {countries?.content.map((country) => (
            <option key={country.countryId} value={country.countryId}>
              {country.countryName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>State Code:</label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
      </div>

      <div>
        <label>State Name:</label>
        <input
          type="text"
          value={formData.stateName}
          onChange={(e) =>
            setFormData({ ...formData, stateName: e.target.value })
          }
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create State'}
      </button>
    </form>
  );
}

// ============================================================================
// Example 8: Complete CRUD Dashboard
// ============================================================================

export function CountryDashboard() {
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingId, setEditingId] = useState<number>();
  const [page, setPage] = useState(0);

  const { data, loading, refetch } = useCountries({ page, size: 10 });

  const handleEdit = (id: number) => {
    setEditingId(id);
    setMode('edit');
  };

  const handleCreateSuccess = () => {
    setMode('list');
    refetch();
  };

  const handleUpdateSuccess = () => {
    setMode('list');
    refetch();
  };

  return (
    <div>
      <h1>Country Management</h1>

      <div>
        <button onClick={() => setMode('list')}>List</button>
        <button onClick={() => setMode('create')}>Create New</button>
      </div>

      {mode === 'list' && (
        <div>
          {loading && <div>Loading...</div>}
          {data && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((country) => (
                    <tr key={country.countryId}>
                      <td>{country.countryId}</td>
                      <td>{country.code}</td>
                      <td>{country.countryName}</td>
                      <td>{country.status}</td>
                      <td>
                        <button onClick={() => handleEdit(country.countryId!)}>
                          Edit
                        </button>
                        <DeleteCountryButton countryId={country.countryId!} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div>
                <button onClick={() => setPage((p) => p - 1)} disabled={data.first}>
                  Previous
                </button>
                <span>
                  Page {data.number + 1} of {data.totalPages}
                </span>
                <button onClick={() => setPage((p) => p + 1)} disabled={data.last}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {mode === 'create' && <CreateCountryForm />}

      {mode === 'edit' && editingId && (
        <EditCountryForm countryId={editingId} />
      )}
    </div>
  );
}

// ============================================================================
// Example 9: Conditional Loading
// ============================================================================

export function ConditionalCountryLoader({ shouldLoad }: { shouldLoad: boolean }) {
  const { data, loading } = useCountries(
    { page: 0, size: 10 },
    {
      enabled: shouldLoad, // Only fetch when shouldLoad is true
    }
  );

  if (!shouldLoad) {
    return <div>Click button to load countries</div>;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {data?.content.map((country) => (
        <li key={country.countryId}>{country.countryName}</li>
      ))}
    </ul>
  );
}

// ============================================================================
// Example 10: Error Handling with Toast Notifications
// ============================================================================

export function CountryListWithToast() {
  const showToast = (message: string, type: 'success' | 'error') => {
    // Replace with your toast library (e.g., react-toastify)
    alert(`[${type.toUpperCase()}] ${message}`);
  };

  const { data, loading, error } = useCountries(
    { page: 0, size: 10 },
    {
      onSuccess: (data) => {
        showToast(`Loaded ${data.content.length} countries`, 'success');
      },
      onError: (error) => {
        showToast(`Failed to load countries: ${error.message}`, 'error');
      },
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>An error occurred. Please try again.</div>;

  return (
    <ul>
      {data?.content.map((country) => (
        <li key={country.countryId}>{country.countryName}</li>
      ))}
    </ul>
  );
}
