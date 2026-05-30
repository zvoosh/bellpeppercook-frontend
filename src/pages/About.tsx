import bellpepper from "/icons/bellpepper-green.svg";

export default function About() {
  return (
    <div className="py-12 sm:py-20">
      {/* HERO */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-10 mb-16 sm:mb-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-green-400 font-medium mb-4">
            Our Story
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
            Food is how we
            <br />
            connect with the world
          </h1>
          <p className="text-white/45 text-base sm:text-lg leading-relaxed">
            BellPepperCooks started as a simple idea — a place where home cooks
            and professional chefs could share what they love most. No fluff, no
            ads, just real recipes from real people.
          </p>
        </div>
        <img
          src={bellpepper}
          alt="BellPepperCooks"
          className="w-32 sm:w-48 md:w-64 opacity-15 select-none md:shrink-0"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 sm:mb-24">
        {[
          { num: "500+", label: "Recipes" },
          { num: "120+", label: "Chefs & Contributors" },
          { num: "80+", label: "Cuisines" },
          { num: "4.9", label: "Average Rating" },
        ].map(({ num, label }) => (
          <div
            key={label}
            className="bg-white/5 border border-white/8 rounded-2xl p-6 sm:p-8"
          >
            <p className="text-3xl sm:text-5xl font-semibold text-green-400 mb-2">{num}</p>
            <p className="text-white/45 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* VALUES */}
      <div className="mb-16 sm:mb-24">
        <p className="text-xs uppercase tracking-widest text-green-400 font-medium mb-4">
          What we stand for
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 sm:mb-12">Our values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              icon: "🌍",
              title: "Global flavours",
              text: "Recipes from every corner of the world, curated by people who live and breathe each culinary tradition.",
            },
            {
              icon: "🤝",
              title: "Community first",
              text: "Every rating, comment and tip makes BellPepperCooks better. We grow together, one dish at a time.",
            },
            {
              icon: "✨",
              title: "Quality above all",
              text: "We care about recipes that actually work. Clear instructions, honest reviews, real results.",
            },
          ].map(({ icon, title, text }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/8 rounded-2xl p-6 sm:p-8 hover:border-white/16 transition-colors"
            >
              <span className="text-4xl mb-6 block">{icon}</span>
              <h3 className="text-lg font-medium mb-3">{title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TEAM */}
      <div className="mb-16 sm:mb-24">
        <p className="text-xs uppercase tracking-widest text-green-400 font-medium mb-4">
          The people behind it
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 sm:mb-12">Meet the team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Dushan Ilich", role: "Founder & Developer", emoji: "👨‍💻" },
            {
              name: "Vlastimir Ilich",
              role: "Support & Operations",
              emoji: "🛠️",
            },
            { name: "Chef Contributors", role: "Recipe Creators", emoji: "👨‍🍳" },
            { name: "The Community", role: "Testers & Reviewers", emoji: "🌍" },
          ].map(({ name, role, emoji }) => (
            <div
              key={name}
              className="bg-white/5 border border-white/8 rounded-2xl p-6 text-center hover:border-white/16 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-white/8 flex items-center justify-center mx-auto mb-4 text-3xl">
                {emoji}
              </div>
              <p className="font-medium text-white mb-1">{name}</p>
              <p className="text-white/40 text-sm">{role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-8 sm:p-12 md:p-16 text-center">
        <p className="text-xs uppercase tracking-widest text-green-400 font-medium mb-4">
          Join us
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
          Ready to share your recipes?
        </h2>
        <p className="text-white/45 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
          Whether you're a home cook or a seasoned chef — your recipes deserve
          to be discovered.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <a
            href="/create"
            className="bg-green-500 hover:bg-green-400 text-black font-medium px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            Create a Recipe
          </a>
          <a
            href="/explore"
            className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            Explore Recipes
          </a>
        </div>
      </div>
    </div>
  );
}
