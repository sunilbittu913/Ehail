# Quick Start Guide

Get started with the Aboosto Configuration Service API hooks in 5 minutes.

## Installation

1. Copy the `hooks` folder into your React project:

```bash
# Copy to your project's src directory
cp -r hooks /path/to/your/project/src/
```

2. Ensure you have React installed:

```bash
npm install react react-dom
# or
yarn add react react-dom
```

## Basic Usage

### Step 1: Import the hooks

```typescript
import { useCountries, useCreateCountry } from './hooks';
```

### Step 2: Use in your component

```typescript
function CountryList() {
  const { data, loading, error } = useCountries({ page: 0, size: 10 });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.content.map(country => (
        <li key={country.countryId}>{country.countryName}</li>
      ))}
    </ul>
  );
}
```

## Common Patterns

### 1. Fetch a List with Pagination

```typescript
function PaginatedList() {
  const [page, setPage] = useState(0);
  const { data } = useCountries({ page, size: 10 });

  return (
    <div>
      {/* List items */}
      <button onClick={() => setPage(p => p - 1)} disabled={data?.first}>
        Previous
      </button>
      <button onClick={() => setPage(p => p + 1)} disabled={data?.last}>
        Next
      </button>
    </div>
  );
}
```

### 2. Create a New Item

```typescript
function CreateForm() {
  const { mutate, loading } = useCreateCountry({
    onSuccess: () => alert('Created!'),
  });

  const handleSubmit = async (e) => {
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
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### 3. Update an Item

```typescript
function EditForm({ id }) {
  const { data: country } = useCountry(id);
  const { mutate } = useUpdateCountry();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mutate({
      id,
      data: { countryName: 'New Name' },
    });
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### 4. Delete an Item

```typescript
function DeleteButton({ id }) {
  const { mutate, loading } = useDeleteCountry({
    onSuccess: () => alert('Deleted!'),
  });

  return (
    <button onClick={() => mutate(id)} disabled={loading}>
      Delete
    </button>
  );
}
```

### 5. Search with Debouncing

```typescript
function SearchableList() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data } = useCountries({ search: debouncedSearch });

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      {/* List items */}
    </div>
  );
}
```

## Configuration

### Custom Base URL

```typescript
import { apiClient } from './hooks';

// Set custom base URL
apiClient.setBaseURL('https://your-api.com');

// Add authentication
apiClient.setHeaders({
  'Authorization': 'Bearer your-token',
});
```

## Available Hooks

### Country Hooks
- `useCountry(id)` - Get single country
- `useCountries(params)` - Get paginated list
- `useCreateCountry()` - Create country
- `useUpdateCountry()` - Update country
- `useDeleteCountry()` - Delete country

### State Hooks
- `useState(id)` - Get single state
- `useStates(params)` - Get paginated list
- `useCreateState()` - Create state
- `useUpdateState()` - Update state
- `useDeleteState()` - Delete state

### City Hooks
- `useCity(id)` - Get single city
- `useCities(params)` - Get paginated list
- `useCreateCity()` - Create city
- `useUpdateCity()` - Update city
- `useDeleteCity()` - Delete city

## TypeScript Support

All hooks are fully typed. Import types as needed:

```typescript
import type { CountryMaster, ApiResponse, PagedData } from './hooks';

const country: CountryMaster = {
  countryId: 1,
  countryName: 'United States',
  code: 'US',
  status: 'ACTIVE',
};
```

## Next Steps

- Check out `examples.tsx` for more detailed examples
- Read `README.md` for comprehensive documentation
- Explore the TypeScript types in `types.ts`

## Need Help?

For API-related questions, contact support@aboosto.com
