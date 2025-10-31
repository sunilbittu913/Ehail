# Aboosto Configuration Service API - React Hooks

This package provides reusable TypeScript React hooks for interacting with the Aboosto Configuration Service API. The hooks follow modern React patterns and provide type-safe interfaces for all API operations.

## Features

- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Reusable**: Clean, composable hooks for all API endpoints
- **Error Handling**: Built-in error handling and loading states
- **Flexible**: Customizable callbacks for success and error scenarios
- **Pagination Support**: Built-in support for paginated list endpoints
- **Search Functionality**: Integrated search capabilities for list endpoints

## Installation

Copy the `hooks` folder into your React project, typically under `src/hooks` or `src/api`.

```bash
# If you need to install dependencies
npm install react
```

## Project Structure

```
hooks/
├── index.ts              # Main entry point, exports all hooks
├── types.ts              # TypeScript type definitions
├── apiClient.ts          # Base HTTP client utility
├── useBaseHooks.ts       # Base query and mutation hooks
├── useCountry.ts         # Country-related hooks
├── useState.ts           # State-related hooks
├── useCity.ts            # City-related hooks
└── README.md             # This file
```

## Quick Start

### 1. Import the hooks

```typescript
import {
  useCountries,
  useCreateCountry,
  useUpdateCountry,
  useDeleteCountry,
} from './hooks';
```

### 2. Use in your components

```typescript
function CountryList() {
  const { data, loading, error, refetch } = useCountries({
    page: 0,
    size: 10,
    search: 'United',
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.content.map(country => (
        <div key={country.countryId}>{country.countryName}</div>
      ))}
    </div>
  );
}
```

## API Reference

### Country Hooks

#### `useCountry(id, options)`

Fetches a single country by ID.

**Parameters:**
- `id` (number): The country ID
- `options` (object, optional):
  - `enabled` (boolean): Whether to execute the query automatically
  - `onSuccess` (function): Callback on successful fetch
  - `onError` (function): Callback on error

**Returns:**
- `data`: The country data or null
- `loading`: Loading state boolean
- `error`: Error object or null
- `refetch`: Function to manually refetch data

**Example:**

```typescript
function CountryDetail({ countryId }: { countryId: number }) {
  const { data, loading, error } = useCountry(countryId, {
    onSuccess: (country) => {
      console.log('Country loaded:', country.countryName);
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>{data.countryName}</h2>
      <p>Code: {data.code}</p>
      <p>Status: {data.status}</p>
    </div>
  );
}
```

#### `useCountries(params, options)`

Fetches a paginated list of countries with optional search.

**Parameters:**
- `params` (object, optional):
  - `page` (number): Page number (0-indexed)
  - `size` (number): Page size
  - `sort` (string[]): Sort fields
  - `search` (string): Search query
- `options` (object, optional): Same as `useCountry`

**Example:**

```typescript
function CountryList() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const { data, loading, error, refetch } = useCountries(
    { page, size: 10, search },
    {
      onSuccess: (data) => {
        console.log(`Loaded ${data.content.length} countries`);
      },
    }
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search countries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      
      {data && (
        <>
          <ul>
            {data.content.map(country => (
              <li key={country.countryId}>{country.countryName}</li>
            ))}
          </ul>
          
          <div>
            <button onClick={() => setPage(p => p - 1)} disabled={data.first}>
              Previous
            </button>
            <span>Page {data.number + 1} of {data.totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={data.last}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

#### `useCreateCountry(options)`

Creates a new country.

**Parameters:**
- `options` (object, optional):
  - `onSuccess` (function): Callback on successful creation
  - `onError` (function): Callback on error

**Returns:**
- `data`: The API response or null
- `loading`: Loading state boolean
- `error`: Error object or null
- `mutate`: Function to trigger the mutation
- `reset`: Function to reset the mutation state

**Example:**

```typescript
function CreateCountryForm() {
  const { mutate, loading, error } = useCreateCountry({
    onSuccess: (response) => {
      console.log('Country created:', response.data);
      // Redirect or show success message
    },
    onError: (error) => {
      console.error('Failed to create country:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await mutate({
      code: 'US',
      countryName: 'United States',
      status: 'ACTIVE',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Country'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

#### `useUpdateCountry(options)`

Updates an existing country.

**Example:**

```typescript
function EditCountryForm({ countryId }: { countryId: number }) {
  const { data: country } = useCountry(countryId);
  const { mutate, loading, error } = useUpdateCountry({
    onSuccess: () => {
      console.log('Country updated successfully');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await mutate({
      id: countryId,
      data: {
        countryName: 'Updated Name',
        status: 'ACTIVE',
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Country'}
      </button>
    </form>
  );
}
```

#### `useDeleteCountry(options)`

Deletes a country.

**Example:**

```typescript
function DeleteCountryButton({ countryId }: { countryId: number }) {
  const { mutate, loading } = useDeleteCountry({
    onSuccess: () => {
      console.log('Country deleted successfully');
      // Redirect or refresh list
    },
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      await mutate(countryId);
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

### State Hooks

The state hooks follow the same pattern as country hooks:

- `useState(id, options)` - Fetch single state
- `useStates(params, options)` - Fetch paginated states
- `useCreateState(options)` - Create new state
- `useUpdateState(options)` - Update existing state
- `useDeleteState(options)` - Delete state

**Example:**

```typescript
function StateSelector({ countryId }: { countryId: number }) {
  const { data, loading } = useStates({
    page: 0,
    size: 100,
    search: '', // Could filter by country
  });

  return (
    <select disabled={loading}>
      <option value="">Select a state</option>
      {data?.content
        .filter(state => state.country?.countryId === countryId)
        .map(state => (
          <option key={state.stateId} value={state.stateId}>
            {state.stateName}
          </option>
        ))}
    </select>
  );
}
```

### City Hooks

The city hooks follow the same pattern:

- `useCity(id, options)` - Fetch single city
- `useCities(params, options)` - Fetch paginated cities
- `useCreateCity(options)` - Create new city
- `useUpdateCity(options)` - Update existing city
- `useDeleteCity(options)` - Delete city

**Example:**

```typescript
function CityForm() {
  const [selectedState, setSelectedState] = useState<number>();
  const { mutate: createCity, loading } = useCreateCity({
    onSuccess: () => {
      alert('City created successfully!');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createCity({
      cityName: 'New York',
      code: 'NYC',
      state: { stateId: selectedState },
      status: 'ACTIVE',
    });
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

## Configuration

### Custom Base URL

You can configure the base URL for the API:

```typescript
import { apiClient } from './hooks';

// Set custom base URL
apiClient.setBaseURL('https://api.example.com');

// Set custom headers (e.g., authentication)
apiClient.setHeaders({
  'Authorization': 'Bearer your-token-here',
});
```

### Custom API Client Instance

You can also create a custom API client instance:

```typescript
import { ApiClient } from './hooks';

const customClient = new ApiClient('https://api.example.com', {
  'Authorization': 'Bearer token',
  'X-Custom-Header': 'value',
});
```

## TypeScript Types

All TypeScript types are exported from the main index file:

```typescript
import type {
  CountryMaster,
  CountryMasterDTO,
  StateMaster,
  StateMasterDTO,
  CityMasterDTO,
  ApiResponse,
  Pageable,
  PagedData,
  ListQueryParams,
} from './hooks';
```

## Error Handling

All hooks provide built-in error handling:

```typescript
const { data, error, loading } = useCountries();

if (error) {
  // Handle error
  console.error('API Error:', error.message);
}
```

You can also use the `onError` callback:

```typescript
const { data } = useCountries({}, {
  onError: (error) => {
    // Custom error handling
    toast.error(`Failed to load countries: ${error.message}`);
  },
});
```

## Advanced Usage

### Conditional Fetching

Use the `enabled` option to control when queries execute:

```typescript
function ConditionalCountry({ shouldFetch, countryId }: Props) {
  const { data } = useCountry(countryId, {
    enabled: shouldFetch, // Only fetch when shouldFetch is true
  });

  return <div>{data?.countryName}</div>;
}
```

### Manual Refetching

Use the `refetch` function to manually trigger a query:

```typescript
function CountryList() {
  const { data, refetch } = useCountries();

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      {/* List content */}
    </div>
  );
}
```

### Chaining Operations

Combine multiple hooks for complex workflows:

```typescript
function CreateStateWithCountry() {
  const { data: countries } = useCountries({ size: 100 });
  const { mutate: createState } = useCreateState({
    onSuccess: (response) => {
      console.log('State created:', response.data);
    },
  });

  const handleSubmit = async (stateName: string, countryId: number) => {
    const country = countries?.content.find(c => c.countryId === countryId);
    
    await createState({
      stateName,
      country,
      status: 'ACTIVE',
    });
  };

  return <form>{/* Form implementation */}</form>;
}
```

## Best Practices

1. **Use TypeScript**: Take advantage of the type definitions for better IDE support and type safety.

2. **Handle Loading States**: Always handle loading states to provide better UX.

3. **Error Boundaries**: Wrap components using these hooks in error boundaries for graceful error handling.

4. **Memoization**: Use `useMemo` and `useCallback` when passing callbacks to avoid unnecessary re-renders.

5. **Pagination**: For large datasets, always use pagination parameters.

6. **Search Debouncing**: When implementing search, debounce the search input to avoid excessive API calls.

```typescript
import { useState, useEffect } from 'react';
import { useCountries } from './hooks';

function SearchableCountryList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, loading } = useCountries({
    search: debouncedSearch,
    page: 0,
    size: 10,
  });

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search countries..."
      />
      {/* List rendering */}
    </div>
  );
}
```

## API Endpoints Reference

### Country Endpoints
- `GET /country/{id}` - Get country by ID
- `GET /country/list` - Get paginated countries
- `POST /country` - Create country
- `PUT /country/{id}` - Update country
- `DELETE /country/{id}` - Delete country

### State Endpoints
- `GET /state/{id}` - Get state by ID
- `GET /state/list` - Get paginated states
- `POST /state` - Create state
- `PUT /state/{id}` - Update state
- `DELETE /state/{id}` - Delete state

### City Endpoints
- `GET /city/{id}` - Get city by ID
- `GET /city/list` - Get paginated cities
- `POST /city` - Create city
- `PUT /city/{id}` - Update city
- `DELETE /city/{id}` - Delete city

## License

This code is provided as-is for use with the Aboosto Configuration Service API.

## Support

For API-related issues, contact the Aboosto development team at support@aboosto.com.
