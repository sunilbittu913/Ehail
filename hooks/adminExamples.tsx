/**
 * Example Usage of Aboosto Admin Service API Hooks
 * This file demonstrates authentication and admin management use cases
 */

import React, { useState, useEffect } from 'react';
import {
  useLogin,
  useLogout,
  useAuth,
  useRiders,
  useRider,
  useCreateRider,
  useUpdateRider,
  useDeleteRider,
  useDrivers,
  useDriver,
  useCreateDriver,
  LoginRequest,
  RiderDTO,
  DriverDTO,
} from './adminIndex';

// ============================================================================
// Example 1: Login Form
// ============================================================================

export function LoginForm() {
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: '',
    password: '',
  });

  const { mutate: login, loading, error } = useLogin({
    onSuccess: (response) => {
      console.log('Login successful:', response);
      alert('Login successful!');
      // Redirect to dashboard
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      console.error('Login failed:', error);
      alert(`Login failed: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Admin Login</h2>

      <div>
        <label>Username:</label>
        <input
          type="email"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          placeholder="admin@dss.aboosto.com"
          required
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </form>
  );
}

// ============================================================================
// Example 2: Protected Route Component
// ============================================================================

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return <>{children}</>;
}

// ============================================================================
// Example 3: Dashboard with Logout
// ============================================================================

export function Dashboard() {
  const { isAuthenticated, logout: authLogout } = useAuth();
  const { logout: performLogout, loading } = useLogout();

  const handleLogout = () => {
    performLogout();
    authLogout();
    window.location.href = '/login';
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
      <button onClick={handleLogout} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

// ============================================================================
// Example 4: Riders List with Pagination
// ============================================================================

export function RidersList() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const { data, loading, error, refetch } = useRiders({
    page,
    size: 10,
    search,
  });

  return (
    <div>
      <h2>Riders Management</h2>

      <input
        type="text"
        placeholder="Search riders..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
      />

      <button onClick={() => refetch()}>Refresh</button>

      {loading && <div>Loading riders...</div>}
      {error && <div>Error: {error.message}</div>}

      {data && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((rider) => (
                <tr key={rider.riderId}>
                  <td>{rider.riderId}</td>
                  <td>{rider.fullName}</td>
                  <td>{rider.phoneNumber}</td>
                  <td>{rider.emailId}</td>
                  <td>{rider.status}</td>
                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
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
  );
}

// ============================================================================
// Example 5: Create Rider Form
// ============================================================================

export function CreateRiderForm() {
  const [formData, setFormData] = useState<RiderDTO>({
    fullName: '',
    phoneNumber: '',
    emailId: '',
    status: 'ACTIVE',
  });

  const { mutate: createRider, loading, error } = useCreateRider({
    onSuccess: (response) => {
      alert('Rider created successfully!');
      setFormData({
        fullName: '',
        phoneNumber: '',
        emailId: '',
        status: 'ACTIVE',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRider(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Rider</h2>

      <div>
        <label>Full Name:</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Phone Number:</label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.emailId}
          onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Rider'}
      </button>

      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </form>
  );
}

// ============================================================================
// Example 6: Drivers List
// ============================================================================

export function DriversList() {
  const [page, setPage] = useState(0);

  const { data, loading, error } = useDrivers({
    page,
    size: 10,
  });

  return (
    <div>
      <h2>Drivers Management</h2>

      {loading && <div>Loading drivers...</div>}
      {error && <div>Error: {error.message}</div>}

      {data && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Vehicle Type</th>
                <th>Status</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((driver) => (
                <tr key={driver.driverId}>
                  <td>{driver.driverId}</td>
                  <td>{driver.fullName}</td>
                  <td>{driver.phoneNumber}</td>
                  <td>{driver.email}</td>
                  <td>{driver.vehicleType}</td>
                  <td>{driver.driverStatus}</td>
                  <td>{driver.averageRating?.toFixed(1)}</td>
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
  );
}

// ============================================================================
// Example 7: Edit Rider Form
// ============================================================================

export function EditRiderForm({ riderId }: { riderId: number }) {
  const { data: rider, loading: loadingRider } = useRider(riderId);
  const [formData, setFormData] = useState<RiderDTO>({});

  const { mutate: updateRider, loading: updating } = useUpdateRider({
    onSuccess: () => {
      alert('Rider updated successfully!');
    },
  });

  useEffect(() => {
    if (rider) {
      setFormData(rider);
    }
  }, [rider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateRider({ id: riderId, data: formData });
  };

  if (loadingRider) return <div>Loading rider...</div>;
  if (!rider) return <div>Rider not found</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Rider: {rider.fullName}</h2>

      <div>
        <label>Full Name:</label>
        <input
          type="text"
          value={formData.fullName || ''}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
      </div>

      <div>
        <label>Status:</label>
        <select
          value={formData.status || ''}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <button type="submit" disabled={updating}>
        {updating ? 'Updating...' : 'Update Rider'}
      </button>
    </form>
  );
}

// ============================================================================
// Example 8: Complete Admin App with Authentication
// ============================================================================

export function AdminApp() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <Dashboard />
      <RidersList />
      <DriversList />
    </div>
  );
}
