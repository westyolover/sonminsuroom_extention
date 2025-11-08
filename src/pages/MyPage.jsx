import React from "react";

const MyPage = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* 왼쪽 컬럼 */}
      <div className="w-full lg:w-1/3 flex-shrink-0">

        {/* 프로필 */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src="/profile.png"
              alt="Profile"
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="space-y-2">
              <div className="flex items-baseline">
                <span className="text-sm font-medium text-gray-600 w-12">name</span>
                <span className="text-lg font-semibold text-gray-900">박소현</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-sm font-medium text-gray-600 w-12">level</span>
                <span className="text-lg font-semibold text-gray-900">7</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-sm font-medium text-gray-600 w-12">point</span>
                <span className="text-lg font-semibold text-gray-900">1300</span>
              </div>
            </div>
          </div>
        </section>

        {/* 나의 최애 */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">나의 최애</h3>

          <div className="flex items-center space-x-4 mb-4 justify-center">
            <img
              src="/sion.jpeg"
              alt="Favorite idol"
              className="w-72 h-72 rounded-xl object-cover"
            />
          </div>
          <div className="flex items-center space-x-4 ml-[12px]">
            <div className="space-y-2">
              <div className="flex items-baseline">
                <span className="text-sm font-medium text-gray-600 w-16">Group</span>
                <span className="text-md font-semibold text-gray-900">NCT</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-sm font-medium text-gray-600 w-16">Name</span>
                <span className="text-md font-semibold text-gray-900">
                  Sion (시온)
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="text-sm font-medium text-gray-600 w-16">
                  Birthday
                </span>
                <span className="text-md font-semibold text-gray-900">
                  2002. 05. 11.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 별자리 */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xl font-semibold text-gray-900">
              나의 별자리
            </p>
            <p className="text-lg text-gray-600">
              5 / 10
            </p>
          </div>
          <div className="relative w-full h-64 mt-6 rounded-lg bg-[#062642]">
            {/* 선: 스케치랑 맞춘 좌표 (viewBox 0~100 기준) */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              {/* 중심에서 좌측 상단: (15,17) -> (40,35) -> (53,53) */}
              <polyline
                points="15,17 40,35 53,53"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="0.6"
              />
              {/* 중심에서 우측 하단: (53,53) -> (65,62) -> (55,81) -> (65,92) */}
              <polyline
                points="53,53 65,62 55,81 65,92"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="0.6"
              />
              {/* 중심에서 좌측 하단: (7,43) -> (53,53) */}
              <polyline
                points="7,43 53,53"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="0.6"
              />
              {/* 중심에서 우측 상단: (53,53) -> (65,62) -> (87,55) -> (93,72) */}
              <polyline
                points="53,53 65,62 87,55 93,72"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="0.6"
              />
            </svg>

            {/* 점들: 스케치에 있던 동그라미 위치랑 맞춘 것들 */}
            {/* 위쪽 가장 큰 점 */}
            <div className="absolute w-9 h-9 bg-amber-300 rounded-full left-[10%] top-[10%]" />
            {/* 왼쪽 아래 점 */}
            <div className="absolute w-7 h-7 bg-amber-300 rounded-full left-[6%] top-[38%]" />
            {/* 대각선 중간 점 */}
            <div className="absolute w-6 h-6 bg-amber-300 rounded-full left-[37%] top-[30%]" />

            {/* 중심 살짝 위 점 */}
            <div className="absolute w-6 h-6 bg-amber-300 rounded-full left-[35%] top-[45%]" />
            {/* 중심 큰 별자리 교차 지점 */}
            <div className="absolute w-9 h-9 bg-amber-300 rounded-full left-[46%] top-[45%]" />

            {/* 오른쪽으로 뻗은 점들 */}
            <div className="absolute w-6 h-6 bg-slate-200 rounded-full left-[61%] top-[57%]" />
            <div className="absolute w-6 h-6 bg-slate-200 rounded-full left-[83%] top-[50%]" />
            {/* 오른쪽 아래 별 모양 대신 동그라미 */}
            <div className="absolute w-9 h-9 bg-slate-200 rounded-full left-[86%] top-[65%]" />

            {/* 아래로 내려가는 갈래 점들 */}
            <div className="absolute w-6 h-6 bg-slate-200 rounded-full left-[51%] top-[76%]" />
            <div className="absolute w-6 h-6 bg-slate-200 rounded-full left-[63%] top-[89%]" />
          </div>
        </section>
      </div>

      {/* 오른쪽 컬럼: My Wish */}
      <div className="w-full lg:w-2/3">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Wish</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* 반복 아이템 1 */}
            <div className="rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <img
                src="/vintage.png"
                alt="Wished item"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800">
                  Mirinaero 솔리 오버핏 빈티지 가디건
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  ₩75,000
                </p>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  출처: Sion&apos;s Log EP.1 (03:15)
                </p>
                <a
                  href="https://m.mirinaero.co.kr/product/%EC%86%94%EB%A6%AC-%EC%98%A4%EB%B2%84%ED%95%8F-%EB%B9%88%ED%8B%B0%EC%A7%80-%EA%B0%80%EB%94%94%EA%B1%B4/1274/"
                  className="mt-auto w-full text-center bg-gray-800 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  구매링크
                </a>
              </div>
            </div>
            {/* 2 */}
            <div className="rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <img
                src="/cardigan.png"
                alt="Wished item"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800">
                  바시티 배색 집업 가디건
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  ₩43,000
                </p>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  출처: Sion&apos;s Log EP.2 (05:20)
                </p>
                <a
                  href="https://huecloset.com/product/%EB%B0%94%EC%8B%9C%ED%8B%B0-%EB%B0%B0%EC%83%89-%EC%A7%91%EC%97%85-%EA%B0%80%EB%94%94%EA%B1%B4/3034"
                  className="mt-auto w-full text-center bg-gray-800 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  구매링크
                </a>
              </div>
            </div>
            {/* 3 */}
            <div className="rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <img
                src="/pants.png"
                alt="Wished item"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800">
                  youthbath KNIT TRIMMING WASHING DENIM_ LIGHT BLUE
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  ₩119,000
                </p>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  출처: Sion&apos;s Log EP.2 (05:20)
                </p>
                <a
                  href="https://global.musinsa.com/au/goods/2740987"
                  className="mt-auto w-full text-center bg-gray-800 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  구매링크
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 맛집 */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Places</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* 반복 아이템 1 */}
            <div className="rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <img
                src="/market.png"
                alt="Wished Place"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800">
                  📍 서문시장 대박떡볶이
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  대구광역시 중구 동성로6길 15
                </p>
                <a
                  href="https://map.naver.com/p/search/%EB%8C%80%EA%B5%AC%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%A4%91%EA%B5%AC%20%EB%8F%99%EC%84%B1%EB%A1%9C6%EA%B8%B8%2015/place/15958330?c=15.00,0,0,0,dh&isCorrectAnswer=true&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202511081032&locale=ko&svcName=map_pcv5&searchText=%EB%8C%80%EA%B5%AC%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%A4%91%EA%B5%AC%20%EB%8F%99%EC%84%B1%EB%A1%9C6%EA%B8%B8%2015"
                  className="mt-auto w-full text-center bg-gray-800 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  지도 보기
                </a>
              </div>
            </div>
            {/* 2 */}
            <div className="rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <img
                src="/bingsu.png"
                alt="Wished Place"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800">
                  📍 서문빙수
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  대구 중구 큰장로26길 25 (지하1층 서141호)
                </p>
                <a
                  href="https://map.naver.com/p/search/%EC%84%9C%EB%AC%B8%EB%B9%99%EC%88%98/place/1082123061?c=15.00,0,0,0,dh&placePath=/home?entry=bmp&from=map&fromPanelNum=2&timestamp=202511081032&locale=ko&svcName=map_pcv5&searchText=%EC%84%9C%EB%AC%B8%EB%B9%99%EC%88%98"
                  className="mt-auto w-full text-center bg-gray-800 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  지도 보기
                </a>
              </div>
            </div>
            {/* 3 */}
            <div className="rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <img
                src="/pond.png"
                alt="Wished Place"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800">
                  📍 수성못
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  대구 수성구 두산동
                </p>
                <a
                  href="https://map.naver.com/p/search/%EC%88%98%EC%84%B1%EB%AA%BB/place/13470879?c=15.00,0,0,0,dh&placePath=/home?entry=bmp&from=map&fromPanelNum=2&timestamp=202511081033&locale=ko&svcName=map_pcv5&searchText=%EC%88%98%EC%84%B1%EB%AA%BB"
                  className="mt-auto w-full text-center bg-gray-800 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  지도 보기
                </a>
              </div>
            </div>
            {/* 4 */}
            <div className="rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <img
                src="/gold.png"
                alt="Wished Place"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800">
                  📍 황금어장
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  전라남도 목포시 해안로 219-1
                </p>
                <a
                  href="https://map.naver.com/p/search/%EC%A0%84%EB%9D%BC%EB%82%A8%EB%8F%84%20%EB%AA%A9%ED%8F%AC%EC%8B%9C%20%ED%95%B4%EC%95%88%EB%A1%9C%20219-1/place/16768368?c=15.00,0,0,0,dh&isCorrectAnswer=true&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202511081033&locale=ko&svcName=map_pcv5&searchText=%EC%A0%84%EB%9D%BC%EB%82%A8%EB%8F%84%20%EB%AA%A9%ED%8F%AC%EC%8B%9C%20%ED%95%B4%EC%95%88%EB%A1%9C%20219-1"
                  className="mt-auto w-full text-center bg-gray-800 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  지도 보기
                </a>
              </div>
            </div>
            {/* 5 */}
            <div className="rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <img
                src="/coffee.png"
                alt="Wished Place"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800">
                  📍 커피창고로
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  전남 목포시 청호로219번길 34-15 북항씨푸드타운 2차 102호
                </p>
                <a
                  href="https://map.naver.com/p/search/%EC%BB%A4%ED%94%BC%EC%B0%BD%EA%B3%A0%EB%A1%9C/place/1484544973?c=15.00,0,0,0,dh&placePath=/home?entry=bmp&from=map&fromPanelNum=2&timestamp=202511081034&locale=ko&svcName=map_pcv5&searchText=%EC%BB%A4%ED%94%BC%EC%B0%BD%EA%B3%A0%EB%A1%9C"
                  className="mt-auto w-full text-center bg-gray-800 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  지도 보기
                </a>
              </div>
            </div>
            {/* 6 */}
            <div className="rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <img
                src="/sea.png"
                alt="Wished Place"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800">
                  📍 유달 해수욕장
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  전남 목포시 해양대학로 59
                </p>
                <a
                  href="https://map.naver.com/p/entry/place/21274474?c=12.00,0,0,0,dh&isCorrectAnswer=true&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202511081035&locale=ko&svcName=map_pcv5"
                  className="mt-auto w-full text-center bg-gray-800 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  지도 보기
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyPage;
