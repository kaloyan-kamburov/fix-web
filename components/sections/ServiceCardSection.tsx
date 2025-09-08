import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export const ServiceCardSection = () => {
  return (
    <section className="px-[104px] py-10 flex flex-col w-full items-center gap-20 relative bg-gray-100 shadow-[0px_4px_4px_#00000040]">
      <Card className="w-full border-0 shadow-none bg-transparent">
        <CardContent className="flex flex-col h-[312px] items-start justify-center gap-3 p-12 relative w-full rounded-xl bg-[linear-gradient(90deg,rgba(28,28,29,1)_7%,rgba(0,0,0,0)_68%)] bg-gray-90">
          <div className="flex flex-col w-[686px] items-start gap-1 relative flex-[0_0_auto] mt-[-14.50px]">
            <h3 className="w-fit mt-[-1.00px] font-semibold text-gray-00 text-2xl leading-[normal] relative tracking-[0]">
              ЗА МАЙСТОРИ
            </h3>

            <h2 className="relative w-[616px] font-bold text-gray-00 text-[40px] tracking-[0] leading-[50px]">
              Работи, когато и колкото искаш – ние ти намираме клиентите
            </h2>
          </div>

          <div className="inline-flex items-start gap-4 relative flex-[0_0_auto] mb-[-14.50px]">
            <Button className="h-auto inline-flex items-center justify-center gap-2 px-6 py-3 relative flex-[0_0_auto] bg-accentaccent rounded-lg border border-solid border-gray-40 shadow-[0px_0px_12px_#00000040] hover:bg-accentaccent/90">
              <span className="relative w-fit mt-[-1.00px] font-button font-[number:var(--button-font-weight)] text-gray-100 text-[length:var(--button-font-size)] text-center tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]">
                Стани майстор във FIX
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
