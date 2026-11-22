import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wfoyaimumwnjbvyqzgyo.supabase.co';
const supabaseKey = 'sb_publishable_6OEm575uzNi0Rk0N5N0Z1Q_Xp19vTFd';

export const supabase = createClient(supabaseUrl, supabaseKey);