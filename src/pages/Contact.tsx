import { useTranslation } from "react-i18next";
import bellpepper from "/icons/bellpepper-green.svg";

export default function Contact() {
  const { t } = useTranslation();

  const contacts = [
    { label: t("contact.support"), value: "dusan.ilic1999@gmail.com" },
    { label: t("contact.telephone"), value: "+381603311553" },
  ];

  const copyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full max-w-2xl">
        <img
          src={bellpepper}
          alt="BellPepperCooks icon"
          className="w-24 sm:w-36 md:w-64 lg:w-80 opacity-80 select-none shrink-0 hidden sm:block"
        />

        <div className="space-y-8 w-full">
          {contacts.map(({ label, value }) => (
            <div key={label} className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-white/35 font-medium">
                {label}
              </p>
              <p className="text-base sm:text-xl text-white font-medium break-all sm:break-normal">
                {value}
              </p>
              <button
                onClick={() => copyToClipboard(value)}
                className="text-xs text-green-400 hover:text-green-300 transition-colors cursor-pointer select-none"
              >
                {t("contact.copyHint")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
