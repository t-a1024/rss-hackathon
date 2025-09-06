import React from 'react';
import { TbBow } from "react-icons/tb";
import BackgroundImage from '../../Image/card_background.jpg';
import Cartographer from "../../Image/Cartographer.png";
import Chronicler from "../../Image/Chronicler.png";
import Inventor from "../../Image/Inventor.png";
import Lightkeeper from "../../Image/Lightkeeper.png";
import Mediator from "../../Image/Mediator.png";
import Ploneer from "../../Image/Ploneer.png"; 
import Traveler from "../../Image/Traveler.png";

export type ProfileProps = {
  name: string;
  role: {
    title: string;
    imageUrl?: string;      
    birthday: string;
    age: number | string;
    enthusiasm: string;
    birthplace: string;
    affiliation: string;
    description: string;
    suitability: string;
  };
  onPrev?: () => void;
  onNext?: () => void;
  showArrows?: boolean;
};

const NO_IMAGE = "/noimage.png";


const roleImageMap: Record<string, string> = {
  Cartographer,
  Chronicler,
  Inventor,
  Lightkeeper,
  Mediator,
  Ploneer,          
  Pioneer: Ploneer,    
  Traveler,
};

const resolveImageByTitle = (title?: string): string | undefined => {
  if (!title) return undefined;

  const parts = title.split("/");
  const primary = parts.length > 1
    ? parts[parts.length - 1].trim()  
    : parts[0].trim();                 

  if (roleImageMap[primary]) return roleImageMap[primary];

  const lowerKey = Object.keys(roleImageMap).find(
    (k) => k.toLowerCase() === primary.toLowerCase()
  );
  return lowerKey ? roleImageMap[lowerKey] : undefined;
};

const Result: React.FC<ProfileProps> = ({ name, role, onPrev, onNext, showArrows = true }) => {
  const mappedSrc = resolveImageByTitle(role.title);
  const imgSrc = mappedSrc || role.imageUrl || NO_IMAGE;

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen w-full p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl overflow-hidden p-5 backdrop-blur-sm md:p-10">
        <div className="flex w-full items-center justify-between flex-col gap-4 md:flex-row md:gap-6">
          
          {/* 左の矢印ボタン */}
          {showArrows ? (
            <button
              type="button"
              onClick={onPrev}
              className="bg-transparent border-none p-0 select-none text-yellow-400 transition-colors hover:text-orange-500 text-6xl md:text-8xl focus:outline-none disabled:opacity-40"
              disabled={!onPrev}
              aria-label="前へ"
              title="前へ"
            >
              <TbBow style={{ transform: 'rotate(180deg)' }} />
            </button>
          ) : <div className="w-0 md:w-8" />}

          {/* カード本体 */}
          <div
            style={{ backgroundImage: `url(${BackgroundImage})` }}
            className="font-kaisei-opti w-full rounded-xl border border-yellow-500 bg-cover bg-center p-5 md:p-8 
                       flex flex-col gap-5 
                       md:grid md:grid-cols-[180px_1fr] md:gap-x-8 md:gap-y-5"
          >
            {/* プロフィール画像 */}
            <img
              src={imgSrc}
              alt={role.title}
              className="h-auto w-full max-w-[200px] rounded-lg border-2 border-yellow-500 object-cover md:h-[180px] md:w-[180px] md:max-w-none"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = NO_IMAGE;
              }}
            />

            {/* テキスト部分 */}
            <div className="flex flex-1 flex-col md:text-left pop">
              {/* タイトル */}
              <h2 className="mb-4 text-3xl font-bold text-black text-center md:text-left md:text-4xl">
                {role.title}
              </h2>

              {/* 基本情報 */}
              <div className="text-base leading-relaxed text-black text-center md:text-left pop">
                名前: {name} <br />
                誕生日：{role.birthday} <br />
                年齢：{role.age} <br />
                出身地：{role.birthplace} <br />
                所属：{role.affiliation} <br />
                意気込み：
                <span className="font-bold text-black">{role.enthusiasm}</span>
              </div>
            </div>

            {/* 説明文 */}
            <div className="md:col-span-2 w-full border-t border-dashed border-black pt-4 text-base leading-relaxed text-black text-left md:border-t-2 md:pt-5 md:text-lg pop">
              <p className="flex">{role.description}</p>
              <p className="mt-2">{role.suitability}</p>
            </div>
          </div>

          {/* 右の矢印ボタン */}
          {showArrows ? (
            <button
              type="button"
              onClick={onNext}
              className="bg-transparent appearance-none border-none p-0 select-none text-yellow-400 transition-colors hover:text-orange-500 text-8xl md:text-8xl focus:outline-none disabled:opacity-40"
              disabled={!onNext}
              aria-label="次へ"
              title="次へ"
            >
              <TbBow />
            </button>
          ) : <div className="w-0 md:w-8" />}
        </div>
      </div>
    </div>
  );
};

export default Result;
