export const environment = {
  production: true,
  supabase: {
    url: 'https://lgpljnwgpuojhixmmmwp.supabase.co', // Replace with your Supabase URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncGxqbndncHVvamhpeG1tbXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTg2MTIsImV4cCI6MjA3MjEzNDYxMn0.OIuSKFet2BE8VwsTO5Eb4MwSVuXqE99UV4I2_UDxA-c' // Replace with your Supabase anon key
  },
  observability: {
    env: 'production',
    // GlitchTip DSN for the FRONTEND project (leave '' to disable error capture)
    sentryDsn: 'https://08ee3aa5148445bfb7726174fbb088b6@homejisst-errors.mavsankar.com/2',
    // HomeServer ingest gateway (anonymous browser beacons go to <url>/web)
    telemetryUrl: 'https://homejisst-ingest.mavsankar.com'
  }
};
