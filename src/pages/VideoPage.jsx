import React from "react";

const VideoPage = () => {
  return (
    <>
      {/* Sion's log 섹션 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sion&apos;s log</h2>

        {/* 가로 스크롤 컨테이너 */}
        <div className="overflow-x-auto pb-3">
          <div className="flex gap-4 flex-nowrap">
            {/* 카드 1 */}
            <a
              href="https://www.youtube.com/watch?v=-C4_0O4qI2Y"
              target="_blank"
              rel="noreferrer"
              className="flex-none w-72 rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow bg-white"
            >
              <img
                src="/1.png"
                alt="Sion's log thumbnail"
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">
                  250919 엔시티 위시 시온 사쿠야 위버스 라이브

                </h3>
                <p className="text-sm text-gray-500 mt-1">2025. 11. 07.</p>
              </div>
            </a>

            {/* 카드 2 */}
            <a
              href="https://www.youtube.com/watch?v=tABXNlKd1mo"
              target="_blank"
              rel="noreferrer"
              className="flex-none w-72 rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow bg-white"
            >
              <img
                src="/2.png"
                alt="Sion's log thumbnail"
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">
                  ⏱ SION : 12AM-4AM | NCT WISH 24hr RELAY CAM

                </h3>
                <p className="text-sm text-gray-500 mt-1">2025. 11. 05.</p>
              </div>
            </a>

            {/* 카드 3 */}
            <a
              href="https://www.youtube.com/watch?v=K_3Xi2utV_4"
              target="_blank"
              rel="noreferrer"
              className="flex-none w-72 rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow bg-white"
            >
              <img
                src="/3.png"
                alt="Sion's log thumbnail"
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">
                  [SUB] 반항미 넘치는(?) 막내를 위해 준비한 매운라면🔥여러모로 Emergency한 워크숍 | 아이돌 인간극장
                </h3>
                <p className="text-sm text-gray-500 mt-1">2025. 11. 02.</p>
              </div>
            </a>

            {/* 카드 4 */}
            <a
              href="https://www.youtube.com/watch?v=DCtKi0xBdsM"
              target="_blank"
              rel="noreferrer"
              className="flex-none w-72 rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow bg-white"
            >
              <img
                src="/4.png"
                alt="Sion's log thumbnail"
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">
                #위시가대구에 🗣:위시 밥 마이 뭇나❓👼🏻:마이 뭇다❗️| #WISHがテグに 🗣: ご飯たくさん食べる❓👼🏻: たくさん食べる❗️

                </h3>
                <p className="text-sm text-gray-500 mt-1">2025. 10. 31.</p>
              </div>
            </a>
          </div>
        </div>
      </section>


      <hr className="my-8 border-gray-200" />

      {/* Weverse 섹션 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Weverse</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* 아이템 1 */}
          <a 
            href="https://shop.weverse.io/ko/shop/KRW/artists/155/sales/46688"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <img
              src="/item1.png"
              alt="Weverse shop item"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">[NCT WISH] NCT WISH 2026 Season's Greetings Share</h3>
              <p className="text-lg font-bold text-gray-900 mt-1">예약판매</p>
              <p className="text-lg font-bold text-gray-900 mt-1">₩49,000</p>
            </div>
          </a>

          {/* 아이템 2 */}
          <a 
            href="https://shop.weverse.io/ko/shop/KRW/artists/155/sales/47149"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <img
              src="/item2.png"
              alt="Weverse shop item"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">[NCT WISH] WICHU FANLIGHT CAP CHARM Share</h3>
              <p className="text-lg font-bold text-gray-900 mt-1">예약판매</p>
              <p className="text-lg font-bold text-gray-900 mt-1">₩13,000</p>
            </div>
          </a>
          {/* 아이템 3 */}
          <a
            href="https://shop.weverse.io/ko/shop/KRW/artists/155/sales/47150"
            target="_blank"
            rel="noreferrer" 
            className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <img
              src="/item3.png"
              alt="Weverse shop item"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">[NCT WISH] SCRUNCHIE Share-SION/RIKU/YUSHI/JAEHEE/RYO/SAKUYA</h3>
              <p className="text-lg font-bold text-gray-900 mt-1">예약판매</p>
              <p className="text-lg font-bold text-gray-900 mt-1">₩15,000</p>
            </div>
          </a>
          <div className="col-span-1 sm:col-span-2 md:col-span-3 flex justify-end">
            <a
              href="https://shop.weverse.io/ko/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block px-6 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              위버스로 이동하기
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default VideoPage;