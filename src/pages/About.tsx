import { useTranslation } from "react-i18next";
import bellpepper from "/icons/bellpepper-green.svg";

export default function About() {
  const { t } = useTranslation();

  const values = [
    { icon: "🌍", title: t("about.value1Title"), text: t("about.value1Text") },
    { icon: "🤝", title: t("about.value2Title"), text: t("about.value2Text") },
    { icon: "✨", title: t("about.value3Title"), text: t("about.value3Text") },
  ];

  const team = [
    { name: "Dushan Ilich", role: t("about.roleDeveloper"), emoji: "👨‍💻" },
    { name: "Vlastimir Ilich", role: t("about.roleSupport"), emoji: "🛠️" },
    { name: "Chef Contributors", role: t("about.roleCreators"), emoji: "👨‍🍳" },
    { name: "The Community", role: t("about.roleCommunity"), emoji: "🌍" },
  ];

  const stats = [
    { num: "500+", label: t("about.statsRecipes") },
    { num: "120+", label: t("about.statsChefs") },
    { num: "80+", label: t("about.statsCuisines") },
    { num: "4.9", label: t("about.statsRating") },
  ];

  return (
    <div className="py-12 sm:py-20">
      {/* HERO */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-10 mb-16 sm:mb-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-green-400 font-medium mb-4">
            {t("about.storyTag")}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6 whitespace-pre-line">
            {t("about.storyTitle")}
          </h1>
          <p className="text-white/45 text-base sm:text-lg leading-relaxed">
            {t("about.storyText")}
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
        {stats.map(({ num, label }) => (
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
          {t("about.valuesTag")}
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 sm:mb-12">
          {t("about.valuesTitle")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {values.map(({ icon, title, text }) => (
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
          {t("about.teamTag")}
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 sm:mb-12">
          {t("about.teamTitle")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map(({ name, role, emoji }) => (
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
          {t("about.ctaTag")}
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
          {t("about.ctaTitle")}
        </h2>
        <p className="text-white/45 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
          {t("about.ctaText")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <a
            href="/create"
            className="bg-green-500 hover:bg-green-400 text-black font-medium px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            {t("about.ctaCreate")}
          </a>
          <a
            href="/explore"
            className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            {t("about.ctaExplore")}
          </a>
        </div>
      </div>
    </div>
  );
}
