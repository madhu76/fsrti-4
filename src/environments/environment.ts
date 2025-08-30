// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  supabase: {
    url: 'https://lgpljnwgpuojhixmmmwp.supabase.co', // Replace with your Supabase URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncGxqbndncHVvamhpeG1tbXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTg2MTIsImV4cCI6MjA3MjEzNDYxMn0.OIuSKFet2BE8VwsTO5Eb4MwSVuXqE99UV4I2_UDxA-c' // Replace with your Supabase anon key
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
