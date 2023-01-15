import { ArrowDownIcon } from '@heroicons/react/24/solid';

export default function TokenReverse({ onReverse }: { onReverse: () => void }) {
  return (
    <div
      className="flex justify-center -my-[10px] relative"
      onClick={onReverse}
    >
      <div className="rounded-2xl bg-slate-700 hover:bg-slate-500 hover:cursor-pointer transition hover:duration-300 p-1.5">
        <ArrowDownIcon className="h-4 w-4 hover:rotate-180 transition duration-150 hover:duration-300 ease-in-out text-white" />
      </div>
    </div>
  );
}