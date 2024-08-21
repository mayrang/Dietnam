"use client";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getAllData } from "../supabase/supabase";
import CarouselCard from "./CarouselCard";

const responsive = {
  mobile: {
    breakpoint: { max: 3000, min: 0 },
    items: 1,
    partialVisibilityGutter: 40,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export default function CarouselPart() {
  const [dataList, setDataList] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllData().then((res) => {
      setDataList(res);
      setLoading(false);
    });
  }, []);
  console.log(dataList);
  return (
    <div className="w-full flex-1 flex flex-col mb-2">
      {dataList?.length > 0 ? (
        <Carousel
          partialVisible
          responsive={responsive}
          swipeable={false}
          containerClass="carousel-container"
          itemClass="carousel-item-padding"
          draggable={true}
          showDots={false}
          additionalTransfrom={20}
          customRightArrow={<CustomRightArrow />}
          infinite={true}
          arrows
          customLeftArrow={<CustomLeftArrow />}
          transitionDuration={500}
          slidesToSlide={1}
        >
          {dataList.map((data) => (
            <CarouselCard key={data.id} data={data} />
          ))}
        </Carousel>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          {loading ? "Loading..." : "There is no route data yet."}
        </div>
      )}
    </div>
  );
}

const CustomLeftArrow = ({ onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType },
  } = rest;
  // onMove means if dragging or swiping in progress.
  return (
    <button
      className="outline-none transition flex items-center justify-center left-[calc(4%+1px)] z-[1000] border-none bg-black opacity-30 min-w-[43px] min-h-[43px] cursor-pointer absolute rounded-[35px]"
      onClick={() => onClick()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
        stroke={"#ffffff"}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
};

const CustomRightArrow = ({ onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType },
  } = rest;
  // onMove means if dragging or swiping in progress.
  return (
    <button
      className="outline-none transition flex items-center justify-center right-[calc(4%+1px)] z-[1000] border-none bg-black opacity-30 min-w-[43px] min-h-[43px] cursor-pointer absolute rounded-[35px]"
      onClick={() => onClick()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
};
