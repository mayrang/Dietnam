"use client";
// import { Button } from "antd";
// import AfterInstallation from "components/AfterInstallation";
// import OverlayLoadingCustom from "components/Common/OverlayLoadingCustom";

import { useEffect, useState, useRef } from "react";
import { getDistance, getFinDist } from "@/utils/calc";
import "./page.module.css";
const HomePage = () => {
  const [currentPosition, setCurrentPosition] = useState([105.1, 21.0]);
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  const [coords, setcoords] = useState({
    err: -1,
  });
  const [locationList, setLocationList] = useState([]);
  const [watchId, setWatchId] = useState(-1);
  const [currentMarker, setCurrentMarker] = useState();
  const [recording, setRecording] = useState(false); //기록 중
  const [readyRecord, setReadyRecord] = useState(false); //시작가능
  const [userCheck, setUserCheck] = useState(false); //유저 확인

  //이전 기록 리셋
  const resetButtonHandler = async (e) => {
    e.preventDefault();
    try {
      setReadyRecord(true);

      alert("기록 삭제 완료");
    } catch (err) {
      alert(err.message);
    }
  };

  //자동 레코드
  const locationAutoButtenListener = async (e) => {
    e.preventDefault();
    console.log("start");
    if (navigator.geolocation) {
      try {
        setRecording(false);

        let before_record = null;
        let counter = 0;
        console.log(navigator.geolocation);
        const newId = navigator.geolocation.watchPosition(
          async (position) => {
            let updateFlag = true;
            const new_record = {
              err: 0,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            //시작
            if (map && currentMarker) {
              console.log(new_record, "in map");
              map.setCenter([
                position.coords.longitude,
                position.coords.latitude,
              ]);
              currentMarker.setLngLat([
                position.coords.longitude,
                position.coords.latitude,
              ]);
            }
            console.log(before_record, new_record);
            if (before_record !== null) {
              const dist = getDistance({
                lat1: before_record.latitude,
                lon1: before_record.longitude,
                lat2: new_record.latitude,
                lon2: new_record.longitude,
              });

              //이동거리가 5m미만이면 안바뀜
              if (dist < 0.005) {
                updateFlag = false;
              }
            }
            if (updateFlag) {
              setcoords(new_record);
              before_record = new_record;

              setLocationList((locationList) => [...locationList, new_record]);
              new_record.counter = counter++;
            }
          },
          (err) => {
            console.log(err);
            throw err;
          },
          {
            enableHighAccuracy: false,
            maximumAge: 2000,
            timeout: 5000,
          }
        );
        setRecording(true);

        setWatchId(newId);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("GPS문제, 기록불가");
    }
  };
  //자동 종료
  const finishAutoRecordButtonListener = async (e) => {
    e.preventDefault();
    try {
      if (watchId !== -1) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(-1);
        const finDist = getFinDist(locationList);
        let finish = 1;
        // if (locationList.length < 3 || finDist > 0.2) {
        finish = 0;
        // }

        if (finish === 0) {
          alert(
            "정상적인 종료 조건이 아닙니다.(3곳 이상 방문, 시작점, 마지막점 200m이내)"
          );
        }

        setLocationList([]);
        setRecordcode(-1);
        setReadyRecord(true);
        setRecording(false);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const locationToString = (coord, idx) => (
    <div key={idx}>
      latitude : {coord.latitude} & longitude : {coord.longitude}
    </div>
  );

  const showLocationList = locationList.map((coord, idx) =>
    locationToString(coord, idx)
  );

  const LoadScript = () => {
    const script = document.createElement("script");
    console.log(123);
    script.src = "/wemap-gl.js";
    document.head.appendChild(script);
    return new Promise((res, rej) => {
      script.onload = () => res();
      script.onerror = () => rej();
    });
  };

  useEffect(() => {
    LoadScript()
      .then(() => {
        console.log(456);
        // 지도를 초기화하는 함수
        const initializeMap = () => {
          const map = new window.wemapgl.WeMap({
            container: mapContainer.current,
            key: "YZkGTFFioePZWDhTolBEFiRFJHDbanHW",
            style: "bright",
            center: currentPosition,
            zoom: 13,
          });

          var directions = new window.wemapgl.WeDirections({
            key: "YZkGTFFioePZWDhTolBEFiRFJHDbanHW",
          });
          map.addControl(directions);

          var filter = new window.wemapgl.WeFilterControl({
            filters: {
              cuisine: {
                text: "Ẩm thực",
                "fa-icon": "fa-cutlery",
                color: "#C70039",
                featureClasses: [
                  "cafe",
                  "restaurant",
                  "fast_food",
                  "food_court",
                ],
                layers: ["poi-level-1", "poi-level-2", "poi-level-3"],
              },
              hotel: {
                text: "Nhà nghỉ",
                "fa-icon": "fa-hotel",
                color: "#C70039",
                featureClasses: ["hotel", "guest_house", "motel"],
                layers: ["poi-level-1", "poi-level-2", "poi-level-3"],
              },
              entertainment: {
                text: "Giải trí",
                "fa-icon": "fa-glass",
                color: "#C70039",
                featureClasses: [
                  "bar",
                  "nightclub",
                  "pub",
                  "theatre",
                  "casino",
                  "cinema",
                ],
                layers: ["poi-level-1", "poi-level-2", "poi-level-3"],
              },
              shopping: {
                text: "Mua sắm",
                "fa-icon": "fa-shopping-bag",
                color: "#C70039",
                featureClasses: [
                  "shop",
                  "grocery",
                  "alcohol_shop",
                  "jewelry",
                  "mall",
                  "supermarket",
                  "fashion",
                  "convenience",
                  "marketplace",
                ],
                layers: ["poi-level-1", "poi-level-2", "poi-level-3"],
              },
            },
          });
          console.log("check", currentPosition);
          const marker = new window.wemapgl.Marker()
            .setLngLat(
              currentPosition ?? [105.82387887026971, 21.042387911156695]
            )
            .addTo(map);

          // map.addTo(currentPositionMarker);
          console.log(marker, "markder");
          map.addControl(filter, "top-left");
          map.on("click", (e) => {
            console.log(e.lngLat);
          });
          console.log("map", map);
          setMap(map);
          setCurrentMarker(marker);
        };

        // 초기화 후 currentPosition이 업데이트되었는지 확인
        const intervalId = setInterval(() => {
          console.log(789);
          clearInterval(intervalId);
          console.log(currentPosition);
          initializeMap();
        }, 0);
      })
      .catch(() => {
        console.error("Script loading failed! Handle this error");
      });
  }, [currentPosition]);

  return (
    <>
      <div>
        <div className="h-[calc(100vh-150px)] w-full">
          <div
            id="mapContainer"
            ref={mapContainer}
            className="h-full w-full"
          ></div>
        </div>
      </div>
      <button onClick={locationAutoButtenListener}>측정시작</button>
      <button onClick={finishAutoRecordButtonListener}>측정종료</button>
      {...showLocationList}
    </>
  );
};

export default HomePage;
