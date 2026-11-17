import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TABLE_MAP = {
  User: 'users',
  Wallet: 'wallets',
  Contest: 'contests',
  Participant: 'participants',
  Vote: 'votes',
  Gift: 'gifts',
  GiftTransaction: 'gift_transactions',
  Transaction: 'transactions',
  PaymentLink: 'payment_links',
  PaymentLinkAccess: 'payment_link_accesses',
  Follower: 'followers',
  UserFavorite: 'user_favorites',
  FanShare: 'fan_shares',
  ContentRegistration: 'content_registrations',
  ContentReport: 'content_reports',
  Winner: 'winners',
  EditionWinner: 'edition_winners',
  FeaturedArtist: 'featured_artists',
  Notification: 'notifications',
  UserBadge: 'user_badges',
  SupportTicket: 'support_tickets',
  WithdrawalRequest: 'withdrawal_requests',
};

function applyFilters(query, filters = {}) {
  Object.entries(filters).forEach(([key, val]) => {
    if (val === undefined) return;
    if (key === '$or' && Array.isArray(val)) {
      const orParts = val
        .map((cond) =>
          Object.entries(cond)
            .map(([k, v]) => {
              if (v && typeof v === 'object' && '$in' in v) {
                return `${k}.in.(${v.$in.join(',')})`;
              }
              return `${k}.eq.${v}`;
            })
            .join(',')
        )
        .filter(Boolean);
      if (orParts.length > 0) query = query.or(orParts.join(','));
    } else if (val === null) {
      query = query.is(key, null);
    } else if (typeof val === 'object' && !Array.isArray(val)) {
      if ('$in' in val) query = query.in(key, val.$in);
      if ('$ne' in val) query = query.neq(key, val.$ne);
      if ('$gt' in val) query = query.gt(key, val.$gt);
      if ('$gte' in val) query = query.gte(key, val.$gte);
      if ('$lt' in val) query = query.lt(key, val.$lt);
      if ('$lte' in val) query = query.lte(key, val.$lte);
    } else {
      query = query.eq(key, val);
    }
  });
  return query;
}

function applySort(query, sortStr) {
  if (!sortStr || typeof sortStr !== 'string') return query;
  const desc = sortStr.startsWith('-');
  const col = desc ? sortStr.slice(1) : sortStr;
  return query.order(col, { ascending: !desc });
}

function createEntityProxy(tableName) {
  return {
    async list(sort = '-created_date', limit = 500) {
      let q = supabase.from(tableName).select('*');
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async filter(filters = {}, sort = '-created_date', limit = 500) {
      let q = supabase.from(tableName).select('*');
      q = applyFilters(q, filters);
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async get(id) {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    async create(payload) {
      const { data, error } = await supabase.from(tableName).insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    async bulkCreate(items) {
      const { data, error } = await supabase.from(tableName).insert(items).select();
      if (error) throw error;
      return data || [];
    },
    async update(id, payload) {
      const { data, error } = await supabase.from(tableName).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    },
  };
}

const entities = new Proxy(
  {},
  {
    get(_, entityName) {
      const table = TABLE_MAP[entityName] || `${String(entityName).toLowerCase()}s`;
      return createEntityProxy(table);
    },
  }
);

export const base44 = {
  entities,
  auth: {
    async me() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        const err = new Error('Not authenticated');
        err.status = 401;
        throw err;
      }
      let { data: profile } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
      if (!profile && user.email) {
        const res = await supabase.from('users').select('*').eq('email', user.email).maybeSingle();
        profile = res.data;
      }
      const role = profile?.role || user.user_metadata?.role || 'user';
      return { ...user, ...(profile || {}), role };
    },
    async updateMe(updates) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.from('users').update(updates).eq('id', user.id).select().single();
      if (error) throw error;
      return data;
    },
    async isAuthenticated() {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    },
    async logout(redirectUrl) {
      await supabase.auth.signOut();
      if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin() {
      window.dispatchEvent(new CustomEvent('open-supabase-auth-modal'));
    },
  },
  functions: {
    async invoke(fnName, payload = {}) {
      if (fnName === 'castVote') {
        const { data, error } = await supabase.rpc('cast_vote_rpc', {
          p_participant_id: payload.participant_id,
          p_device_fingerprint: payload.device_fingerprint || '',
        });
        if (error) return { data: { success: false, error: error.message } };
        return { data };
      }
      if (fnName === 'getArtistGiftStats') {
        const { data, error } = await supabase.rpc('get_artist_gift_stats_rpc', {
          p_artist_ids: payload.artist_ids || [],
        });
        if (error) return { data: { stats: {} } };
        return { data };
      }
      return { data: null };
    },
  },
  integrations: {
    Core: {
      async UploadFile({ file }) {
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('uploads').upload(fileName, file);
        if (error) throw error;
        const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
        return { file_url: data.publicUrl };
      },
      async SendEmail() { return { success: true }; },
      async SendSMS() { return { success: true }; },
      async InvokeLLM() { return { result: '' }; },
      async GenerateImage() { return { url: '' }; },
      async ExtractDataFromUploadedFile() { return { output: {} }; },
    },
  },
};
