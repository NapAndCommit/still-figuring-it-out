import LifeAreaCard from "../components/LifeAreaCard";

const lifeAreas = [
  {
    name: "Career",
    confidence: "Clarity feels low right now",
    helper: "You don't need to define this yet.",
  },
  {
    name: "Money",
    confidence: "Still forming",
    helper: "It's okay if this changes.",
  },
  {
    name: "Relationships",
    confidence: "Unclear is still a valid state",
    helper: "You can leave this unfinished.",
  },
  {
    name: "Identity",
    confidence: "Still forming",
    helper: "It's okay if this feels unclear.",
  },
  {
    name: "Health",
    confidence: "Clarity feels low right now",
    helper: "Uncertainty is part of the process.",
  },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Intro section */}
      <div className="mb-16 text-center">
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-600">
          This is a space to hold what you don't have answers to yet.
        </p>
      </div>

      {/* Life Areas Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lifeAreas.map((area) => (
          <LifeAreaCard
            key={area.name}
            name={area.name}
            confidence={area.confidence}
            helper={area.helper}
          />
        ))}
      </div>
    </div>
  );
}

