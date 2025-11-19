import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // عدّل المسار إن اختلف

export default function MaintenanceToggle() {
  const [loading, setLoading] = useState(true);
  const [on, setOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'maintenance')
        .single();
      if (error && error.code !== 'PGRST116') {
        setError(error.message);
      } else {
        setOn(Boolean(data?.value));
      }
      setLoading(false);
    })();
  }, []);

  async function toggle() {
    setLoading(true);
    const newVal = !on;
    const { error } = await supabase.from('site_settings').upsert({
      key: 'maintenance',
      value: newVal,
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' });
    if (error) {
      setError(error.message);
    } else {
      setOn(newVal);
      setError(null);
    }
    setLoading(false);
  }

  return (
    <div>
      <h3>وضع الصيانة</h3>
      <p>حالة الموقع حالياً: <strong>{on ? 'مفعّل' : 'معطّل'}</strong></p>
      <button onClick={toggle} disabled={loading} style={{padding:'8px 12px',borderRadius:8}}>
        {loading ? 'جارٍ...' : (on ? 'إيقاف الصيانة' : 'تشغيل الصيانة')}
      </button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  );
}