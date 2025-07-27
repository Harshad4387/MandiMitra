import React from 'react';

export default function ProfileField({ label, value }) {
  return (
    <div className="space-y-1">
      <label className="block text-gray-700">{label}</label>
      <p className="text-gray-900">{value || 'N/A'}</p>
    </div>
  );
}