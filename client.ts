import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nkeoeafpyezjopgisxyh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZW9lYWZweWV6am9wZ2lzeHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjgyMDQsImV4cCI6MjA4MDk0NDIwNH0.QP0dF-XJ08WveHaTX6W-yUy4QbyeSAxXjundVTiud0E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// For React:
// import { supabase } from "@/integrations/supabase/client";
// For React Native:
// import { supabase } from "@/src/integrations/supabase/client";
