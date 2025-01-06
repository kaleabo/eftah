"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";

interface ContactInfo {
  phone1: string;
  phone2: string;
}

const TopBar = ({ contactInfo }: { contactInfo: ContactInfo | null }) => {
  const phone1 = contactInfo?.phone1 ?? "";
  const phone2 = contactInfo?.phone2 ?? "";
  return (
    <div className="bg-red-100 border-red-200 border-b z-50 px-5 py-1">
      <div className="mx-auto flex max-w-6xl items-center justify-center md:justify-between">
        <div>
          <p className="text-xs hidden md:block text-red-800">
            ይደውሉልን!! በርገር እና ፒዛ ለተለያዩ ፕሮግራሞች እናቀርባለን
          </p>
        </div>
        <div className="flex items-center gap-7">
          {phone1 && (
            <a
              href={`tel:${phone1}`}
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Phone className="size-4 text-red-500" />
              <span className="text-red-800">{phone1}</span>
            </a>
          )}
          {phone2 && (
            <a
              href={`tel:${phone2}`}
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Phone className="size-4 text-red-500" />
              <span className="text-red-800">{phone2}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
