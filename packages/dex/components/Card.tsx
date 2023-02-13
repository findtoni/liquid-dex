import React from 'react';

export default function Card({ children }: { children: React.ReactNode}) {
  return (
    <div className="flex justify-center">
      <div className="w-[28%] h-auto">
        <div className="bg-slate-800 rounded-2xl p-4">
          <div className="flex flex-col">
            { children }
          </div>
        </div>
      </div>
    </div>
  );
}