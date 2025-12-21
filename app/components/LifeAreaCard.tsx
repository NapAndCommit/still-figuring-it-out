interface LifeAreaCardProps {
  name: string;
  confidence: string;
  helper: string;
}

export default function LifeAreaCard({
  name,
  confidence,
  helper,
}: LifeAreaCardProps) {
  return (
    <div className="group relative rounded-2xl bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Subtle uncertainty indicator - soft dots */}
      <div className="mb-6 flex gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-neutral-200 opacity-40"
          />
        ))}
      </div>

      <h3 className="mb-4 text-xl font-light text-neutral-800">{name}</h3>

      <p className="mb-4 text-sm leading-relaxed text-neutral-600">
        {confidence}
      </p>

      <p className="text-xs leading-relaxed text-neutral-400">{helper}</p>
    </div>
  );
}

