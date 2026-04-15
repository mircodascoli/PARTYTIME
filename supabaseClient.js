import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://idgwdqpndasbhmsmzqll.supabase.co';
const supabaseKey = 'sb_publishable_qt-qCP9cXV1KFKw38UjXaQ_gz1eKg_T';

export const supabase = createClient(supabaseUrl, supabaseKey);