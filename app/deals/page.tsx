'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('lead');

  const fetchData = async () => {
    const { data: dealsData } = await supabase.from('deals').select('*');
    const { data: customersData } = await supabase.from('customers').select('*');
    setDeals(dealsData || []);
    setCustomers(customersData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addDeal = async () => {
    await supabase.from('deals').insert([
      {
        title,
        customer_id: Number(customerId),
        amount: Number(amount),
        status,
      },
    ]);
    setTitle('');
    setCustomerId('');
    setAmount('');
    setStatus('lead');
    fetchData();
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'lead':
        return '🟡 商談中';
      case 'won':
        return '🟢 成約';
      case 'lost':
        return '🔴 失注';
      default:
        return status;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>案件管理</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          placeholder="案件名"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">顧客選択</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          placeholder="金額"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="lead">商談中</option>
          <option value="won">成約</option>
          <option value="lost">失注</option>
        </select>
        <button onClick={addDeal}>登録</button>
      </div>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>案件名</th>
            <th>顧客ID</th>
            <th>金額</th>
            <th>ステータス</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.title}</td>
              <td>{d.customer_id}</td>
              <td>{d.amount}</td>
              <td>{getStatusLabel(d.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}