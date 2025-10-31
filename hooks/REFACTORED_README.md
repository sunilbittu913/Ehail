# Refactored Hooks with useFetch Pattern

All hooks have been refactored to use a reusable `useFetch` pattern with abort controllers, automatic cleanup, and better error handling.

## Key Improvements

### ✅ Abort Controller Support
- Automatic request cancellation when component unmounts
- Prevents memory leaks and race conditions
- Clean cleanup on every re-render

### ✅ Better Error Handling
- Consistent error format across all hooks
- Proper error propagation
- Error callbacks for custom handling

### ✅ Simpler API
- Cleaner, more intuitive hook interface
- Less boilerplate code
- Better TypeScript support

### ✅ Automatic Refetch
- Built-in refetch functionality
- Easy data refresh
- Optimistic updates support

## Core Hook: useFetch

```typescript
import { useFetch } from './hooks/useApi';

function MyComponent() {
  const { data, loading, error, refetch } = useFetch(
    'http://api.example.com/data',
    {
      enabled: true,
      onSuccess: (data) => console.log('Success:', data),
      onError: (error) => console.error('Error:', error),
    }
  );

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>{JSON.stringify(data)}</div>}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## Core Hook: useMutation

```typescript
import { useMutation } from './hooks/useApi';

function CreateForm() {
  const { mutate, loading, error } = useMutation(
    async (formData) => {
      const response = await fetch('/api/create', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      return response.json();
    },
    {
      onSuccess: (data) => alert('Created!'),
      onError: (error) => alert('Failed!'),
    }
  );

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutate({ name: 'Test' });
    }}>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

## Usage Examples

### Configuration Service

```typescript
import { useCountries, useCreateCountry } from './hooks/indexRefactored';

function CountriesPage() {
  const { data, loading, error, refetch } = useCountries({
    page: 0,
    size: 10,
  });

  const { mutate: createCountry } = useCreateCountry({
    onSuccess: () => refetch(), // Auto-refresh list
  });

  return (
    <div>
      {loading && <div>Loading...</div>}
      {data?.content.map(country => (
        <div key={country.countryId}>{country.countryName}</div>
      ))}
      <button onClick={() => createCountry({
        code: 'US',
        countryName: 'United States',
        status: 'ACTIVE',
      })}>
        Add Country
      </button>
    </div>
  );
}
```

### Admin Service with Authentication

```typescript
import { useLogin, useRiders } from './hooks/indexRefactored';

function LoginPage() {
  const { mutate: login, loading } = useLogin({
    onSuccess: () => {
      console.log('Logged in!');
      // Token is automatically stored
    },
  });

  return (
    <button onClick={() => login({
      username: 'admin@dss.aboosto.com',
      password: 'password',
    })} disabled={loading}>
      Login
    </button>
  );
}

function RidersPage() {
  const { data, loading, refetch } = useRiders({ page: 0, size: 10 });

  return (
    <div>
      {data?.content.map(rider => (
        <div key={rider.riderId}>{rider.fullName}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## Migration Guide

### Old Pattern (useBaseHooks)

```typescript
const { data, loading, error } = useQuery(
  async () => {
    const response = await apiClient.get('/country/list');
    return response.data;
  },
  options
);
```

### New Pattern (useFetch)

```typescript
const { data, loading, error } = useCountries(
  { page: 0, size: 10 },
  options
);
```

## Benefits

1. **Automatic Cleanup** - No more memory leaks
2. **Race Condition Prevention** - Abort controllers handle this
3. **Simpler Code** - Less boilerplate
4. **Better DX** - More intuitive API
5. **Type Safety** - Full TypeScript support

## File Structure

```
hooks/
├── useApi.ts                    # Core useFetch and useMutation
├── useCountryRefactored.ts      # Country hooks
├── useStateRefactored.ts        # State hooks
├── useCityRefactored.ts         # City hooks
├── useAdminRefactored.ts        # Admin, Rider, Driver hooks
└── indexRefactored.ts           # Main entry point
```

## Import from Refactored Hooks

```typescript
// Use the refactored index
import {
  useCountries,
  useCreateCountry,
  useLogin,
  useRiders,
} from './hooks/indexRefactored';
```

## Backward Compatibility

The original hooks are still available in the repository:
- `index.ts` - Original hooks
- `indexRefactored.ts` - New refactored hooks

You can migrate gradually or use both side by side.
