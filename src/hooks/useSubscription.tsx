import { useProfile } from "@/hooks/useProfile";

export function useSubscription() {
  const { profile, loading, refetch } = useProfile();

  const isActive = profile?.subscription_status === "active";
  const plan = profile?.subscription_plan || null;
  const expiresAt = profile?.subscription_expires_at
    ? new Date(profile.subscription_expires_at)
    : null;
  const isExpired = expiresAt ? expiresAt < new Date() : false;

  return {
    isActive: isActive && !isExpired,
    plan,
    expiresAt,
    isExpired,
    status: profile?.subscription_status || "pending",
    loading,
    refetch,
  };
}
