// No-op SecretGuard kept for compatibility.
// The app uses server-side or store-based auth (`ProtectedRoute`) for admin.
export default function SecretGuard({ children }) {
  return children;
}
