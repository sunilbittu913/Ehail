# Ehail - Aboosto Configuration Service API Hooks

This repository contains reusable TypeScript React hooks for the Aboosto Configuration Service API.

## Overview

The `hooks` folder contains a complete set of type-safe React hooks for interacting with the Aboosto Configuration Service API, which manages Country, State, and City master data.

## Quick Start

```bash
# Copy the hooks folder to your React project
cp -r hooks /path/to/your/project/src/
```

Then import and use in your components:

```typescript
import { useCountries, useCreateCountry } from './hooks';

function CountryList() {
  const { data, loading } = useCountries({ page: 0, size: 10 });
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <ul>
      {data?.content.map(country => (
        <li key={country.countryId}>{country.countryName}</li>
      ))}
    </ul>
  );
}
```

## Documentation

- **[Quick Start Guide](hooks/QUICKSTART.md)** - Get started in 5 minutes
- **[Full Documentation](hooks/README.md)** - Comprehensive API reference
- **[Examples](hooks/examples.tsx)** - 10+ real-world usage examples

## Features

- ✅ Full TypeScript support
- ✅ CRUD operations for Country, State, and City
- ✅ Pagination and search
- ✅ Error handling and loading states
- ✅ Customizable configuration

## API Endpoints

The hooks connect to the Aboosto Configuration Service API at `http://3.13.116.236:8081`

### Available Entities
- **Countries** - Country master data
- **States** - State master data (linked to countries)
- **Cities** - City master data (linked to states)

## License

MIT
