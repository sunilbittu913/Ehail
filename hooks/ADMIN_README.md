# Aboosto Admin Service API - React Hooks

This document covers the Admin Service API hooks for authentication, rider management, and driver management.

## Features

- **Authentication** - Login/logout functionality with token management
- **Rider Management** - CRUD operations for riders
- **Driver Management** - CRUD operations for drivers
- **Type-Safe** - Full TypeScript support
- **Token Persistence** - Automatic token storage in localStorage

## Quick Start

### Authentication Example

```typescript
import { useLogin, useAuth } from './hooks/adminIndex';

function LoginForm() {
  const { mutate: login, loading } = useLogin({
    onSuccess: () => alert('Logged in!'),
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      login({ username: 'admin@dss.aboosto.com', password: 'pass' });
    }}>
      <button type="submit" disabled={loading}>Login</button>
    </form>
  );
}
```

### Rider Management Example

```typescript
import { useRiders, useCreateRider } from './hooks/adminIndex';

function RidersPage() {
  const { data, loading } = useRiders({ page: 0, size: 10 });
  const { mutate: createRider } = useCreateRider();

  return <div>{/* Render riders */}</div>;
}
```

## Available Hooks

### Authentication
- useLogin() - Admin login
- useLogout() - Logout and clear token
- useAuth() - Authentication state management

### Riders
- useRider(id) - Get single rider
- useRiders(params) - Get paginated riders
- useCreateRider() - Create new rider
- useUpdateRider() - Update rider
- useDeleteRider() - Delete rider

### Drivers
- useDriver(id) - Get single driver
- useDrivers(params) - Get paginated drivers
- useCreateDriver() - Create new driver
- useUpdateDriver() - Update driver
- useDeleteDriver() - Delete driver

See adminExamples.tsx for detailed usage examples.
