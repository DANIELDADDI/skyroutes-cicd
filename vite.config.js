import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
      plugins: [react()],
      base:"skyroutes-cicd/",
      server:{
            open: true,                 // Automatically open the app in the browser on server start
            port: 3001,                // default value is 5173
            // strictPort: true,         // Set to true to exit if port is already in use, instead of automatically trying the next available port.  
            // host: localhost,         // default value , Set this to 0.0.0.0 or true to listen on all addresses, including LAN and public addresses.
            
            // allowedHosts:['localhost','.localhost','shegertravel.et'] ,       // default []
            // https: https.ServerOptions,



      }
})
