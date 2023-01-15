import React from 'react';

export default function Card({ children }: { children: React.ReactNode}) {
  return (
    <div className="flex justify-center">
      <div className="w-4/12 h-auto">
        <div className="bg-slate-800 rounded-xl py-5 px-4">
          <div className="flex flex-col">
            { children }
          </div>
        </div>
      </div>
    </div>
  );
}