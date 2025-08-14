export function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-600 mb-4">
                When you connect your Strava account, we collect:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Your Strava profile information (name, profile image)</li>
                <li>Your Strava activities (time, location, type)</li>
                <li>OAuth tokens to access your Strava account</li>
                <li>Session cookies for keeping you logged in</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4">
                We use your information only to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Fetch weather data for your activities</li>
                <li>
                  Update your Strava activity descriptions with weather info
                </li>
                <li>Keep you logged in to our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Third Party Services
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Strava:</strong> For accessing your activities
                </li>
                <li>
                  <strong>OpenWeatherMap:</strong> For weather data (we only
                  send time/location, no personal info)
                </li>
              </ul>
              <p className="text-gray-600 mt-4">
                We never sell your data or use tracking/analytics services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your Rights & Data Deletion
              </h2>
              <p className="text-gray-600 mb-4">You can:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Disconnect Strava from our app's dashboard (this also deletes
                  all your data with us)
                </li>
                <li>
                  Revoke access on{" "}
                  <a
                    href="https://www.strava.com/settings/apps"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Strava
                  </a>{" "}
                  (this also deletes all your data with us)
                </li>
                <li>Export your data by contacting us</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Contact
              </h2>
              <p className="text-gray-600">
                For any privacy questions or data requests, email:{" "}
                <a
                  href="mailto:rain-or-shine@ngridge.com"
                  className="text-blue-600 hover:underline"
                >
                  rain-or-shine@ngridge.com
                </a>
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-500 mt-8">
                Last updated: 2 July 2025
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
