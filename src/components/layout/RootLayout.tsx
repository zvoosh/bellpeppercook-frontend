import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";
import bellpepper from "/icons/bellpepper-green.svg";
import { useAuth } from "../../hooks/useAuth";

export const RootLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === "en" ? "sr" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  const NAV_LINKS = [
    { to: "/", label: t("nav.home") },
    { to: "/explore", label: t("nav.explore") },
    ...(isAuthenticated && user
      ? [{ to: "/create", label: t("nav.create") }]
      : []),
    ...(isAuthenticated && user
      ? [{ to: `/profile/${user.id}`, label: t("nav.profile") }]
      : []),
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/90 backdrop-blur-sm border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <img src={bellpepper} alt="bellpepper icon" className="w-11" />
            <span className="font-semibold text-lg tracking-tight">
              BellPepper<span className="text-green-400">Cooks</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full text-sm transition-colors duration-150 ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/55 hover:text-white hover:bg-white/6"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <button
              onClick={toggleLang}
              className="text-xs font-medium text-white/35 hover:text-white transition-colors px-2 py-1 rounded border border-white/10 hover:border-white/25"
            >
              {i18n.language === "en" ? "SR" : "EN"}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/signin";
                }}
                className="text-sm text-white/55 hover:text-white transition-colors px-3 py-2"
              >
                {t("nav.signOut")}
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  className={`text-sm text-white/55 hover:text-white transition-colors px-3 py-2 ${
                    location.pathname.includes("signin")
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  to="/signin?tab=register"
                  className={`text-sm bg-green-500 hover:bg-green-400 text-black font-medium px-4 py-2 rounded-full transition-colors ${
                    location.pathname.includes("signin")
                      ? "!bg-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {t("nav.getStarted")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Get Started + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="text-xs font-medium text-white/35 hover:text-white transition-colors px-2 py-1 rounded border border-white/10"
            >
              {i18n.language === "en" ? "SR" : "EN"}
            </button>
            {!isAuthenticated && (
              <Link
                to="/signin?tab=register"
                className="text-sm bg-green-500 hover:bg-green-400 text-black font-medium px-4 py-2 rounded-full transition-colors"
              >
                {t("nav.getStarted")}
              </Link>
            )}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/8 transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-5 bg-white transition-transform duration-200 origin-center ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition-transform duration-200 origin-center ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden border-t border-white/8 bg-[#111111]/95 backdrop-blur-sm">
            <ul className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl text-sm transition-colors duration-150 ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/55 hover:text-white hover:bg-white/6"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2 mt-1 border-t border-white/8">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.location.href = "/signin";
                    }}
                    className="block w-full text-left px-4 py-2.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/6 transition-colors"
                  >
                    {t("nav.signOut")}
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/6 transition-colors"
                  >
                    {t("nav.signIn")}
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        )}
      </header>

      <Toaster position="bottom-right" richColors />

      {/* PAGE CONTENT */}
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollRestoration />
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0D0D0D] border-t border-white/8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={bellpepper} alt="bellpepper icon" className="w-11" />
                <span className="font-semibold text-lg">
                  BellPepper<span className="text-green-400">Cooks</span>
                </span>
              </div>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                {t("footer.tagline")}
              </p>
            </div>
            <nav className="flex flex-wrap gap-4 sm:gap-6">
              {[
                { to: "/", label: t("nav.home") },
                { to: "/explore", label: t("nav.explore") },
                { to: "/my-recipes", label: t("footer.myRecipes") },
                { to: "/create", label: t("footer.createRecipe") },
                { to: "/about", label: t("nav.about") },
                { to: "/contact", label: t("nav.contact") },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm text-white/45 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/25">{t("footer.copyright")}</p>
            <div className="flex gap-5">
              {["Instagram", "Facebook", "Twitter", "YouTube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-xs text-white/35 hover:text-white transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
