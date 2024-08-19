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
  useEffect(() => {
    getAllData().then((res) => {
      setDataList(res);
    });
  }, []);
  console.log(dataList);
  return (
    <div className="w-full flex-1 py-5 flex flex-col">
      {dataList?.length > 0 && (
        <Carousel
          partialVisbile
          responsive={responsive}
          swipeable={true}
          containerClass="carousel-container"
          itemClass="carousel-item-padding"
          draggable={true}
          showDots={false}
          additionalTransfrom={20}
          infinite={true}
          arrows={false}
          transitionDuration={500}
          slidesToSlide={1}
        >
          {dataList.map((data) => (
            <CarouselCard key={data.id} data={data} />
          ))}
        </Carousel>
      )}
    </div>
  );
}
