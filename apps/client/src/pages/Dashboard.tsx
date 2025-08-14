import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CloudRain, AlertCircle, AlertTriangle } from "lucide-react";

export function Dashboard() {
  const { user, updateUser, revokeAccess } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const toggleWeatherEnabled = async () => {
    if (!user || updating) return;

    try {
      setUpdating(true);
      setError(null);

      const newEnabled = !user.weatherEnabled;
      await api.updateUserPreferences({ weatherEnabled: newEnabled });
      updateUser({ weatherEnabled: newEnabled });
    } catch (error) {
      console.error("Failed to update preferences:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update preferences",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleRevoke = async () => {
    try {
      setIsRevoking(true);
      setError(null);

      await revokeAccess();
      // The revokeAccess function will handle the redirect
    } catch (error) {
      console.error("Failed to revoke access:", error);
      setError(
        error instanceof Error ? error.message : "Failed to revoke access",
      );
      setIsRevoking(false);
      setShowConfirmDialog(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>
              Please sign in to view your dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const memberSinceDate = new Date(user.memberSince);
  const lastUpdatedDate = new Date(user.lastUpdated);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.firstName || "Athlete"}! 👋
        </h1>
        <p className="text-muted-foreground">Manage your weather updates</p>
      </div>

      {/* Weather Settings Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="h-5 w-5" />
                Weather Updates
              </CardTitle>
              <CardDescription>
                Automatically add weather data to your Strava activities
              </CardDescription>
            </div>
            <Badge variant={user.weatherEnabled ? "default" : "secondary"}>
              {user.weatherEnabled ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Enable Weather Updates</p>
              <p className="text-sm text-muted-foreground">
                {user.weatherEnabled
                  ? "New activities will automatically get weather data"
                  : "Turn on to start adding weather data to activities"}
              </p>
            </div>
            <Switch
              checked={user.weatherEnabled}
              onCheckedChange={toggleWeatherEnabled}
              disabled={updating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your Rain or Shine account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Strava ID</p>
              <p className="font-medium">{user.stravaAthleteId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">{user.location || "Not set"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {memberSinceDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {lastUpdatedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-6 pt-6 border-t">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <h3 className="font-semibold">Danger Zone</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Disconnecting your Strava account will stop weather updates and
                delete all your data from Rain or Shine.
              </p>

              {!showConfirmDialog ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowConfirmDialog(true)}
                >
                  Disconnect Strava Account
                </Button>
              ) : (
                <div className="space-y-3 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <p className="text-sm font-medium">
                    Are you sure you want to disconnect your Strava account?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. You'll need to reconnect and
                    reauthorize to use Rain or Shine again.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRevoke}
                      disabled={isRevoking}
                    >
                      {isRevoking ? "Disconnecting..." : "Yes, Disconnect"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfirmDialog(false)}
                      disabled={isRevoking}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
