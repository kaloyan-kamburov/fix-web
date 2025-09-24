import { useTranslations } from "next-intl";
import * as React from "react";

export const SecurityNotice: React.FC = () => {
  const t = useTranslations();
  return (
    <div className="flex gap-1 items-center self-stretch p-1 rounded-lg border border-solid bg-yellow-100 bg-opacity-40 border-yellow-600 border-opacity-50">
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="warning-icon" style="width: 20px; height: 20px"> <path d="M9.16602 12.5H10.8327V14.1666H9.16602V12.5ZM9.16602 5.83329H10.8327V10.8333H9.16602V5.83329ZM9.99102 1.66663C5.39102 1.66663 1.66602 5.39996 1.66602 9.99996C1.66602 14.6 5.39102 18.3333 9.99102 18.3333C14.5993 18.3333 18.3327 14.6 18.3327 9.99996C18.3327 5.39996 14.5993 1.66663 9.99102 1.66663ZM9.99935 16.6666C6.31602 16.6666 3.33268 13.6833 3.33268 9.99996C3.33268 6.31663 6.31602 3.33329 9.99935 3.33329C13.6827 3.33329 16.666 6.31663 16.666 9.99996C16.666 13.6833 13.6827 16.6666 9.99935 16.6666Z" fill="#C59A02" fill-opacity="0.5"></path> </svg>',
          }}
        />
      </div>
      <div className="text-sm flex-[1_0_0] text-neutral-400 font-normal text-left">
        <span className="font-bold">{t("securityNotice")}</span>&nbsp;
        {t("securityNoticeDescription")}
      </div>
    </div>
  );
};
