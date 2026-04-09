import { supabase } from '../lib/supabase';

export default async function Home() {
  const { data: customers } = await supabase.from('customers').select('*');

  return (
    <div>
      <h1>顧客一覧</h1>
      <ul>
        {customers?.map((c: any) => (
          <li key={c.id}>{c.name} - {c.company}</li>
        ))}
      </ul>
    </div>
  );
}
