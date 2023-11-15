/* eslint-disable */
/*global kakao */
import React, { useEffect, useState } from "react";
import { fireStore } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";

import saveMarker from '../Assets/Imgs/favoritePlace.png'
import './Map.css'

function Map() {
    const [latitude, setLatitude] = useState('');      // 위도 정보
    const [longitude, setLongitude] = useState('');   // 경도 정보
    const [mapData, setMapData] = useState([]);     // 파이어베이스에서 가져온 값이 담기는 곳
    const [userUID, setUserUID] = useState('')

    useEffect(() => {
        console.log()
        let container = document.getElementById("map"); // 지도를 담을 영역의 DOM 레퍼런스
        let options = {
            center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
            level: 5, // 지도의 확대 레벨
        };
        const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT); // 지도 확대 축소 기능

        var geocoder = new kakao.maps.services.Geocoder();
        var marker = new kakao.maps.Marker();
        var imageSrc = saveMarker
        var imageSize = new kakao.maps.Size(35, 35) // 마커이미지의 크기입니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)

        const iwContent =
            `
        <div>
            <div class="customOverlay">
                <span class="travelRecord">여행 기록</span>
                <span class="visitLater">가볼 곳</span>
                <span class="closeMarker">X</span>
            </div>
        </div>
        `;

        var customOverlay = null
        var receiveData = null

        searchAddrFromCoords(map.getCenter(), displayCenterInfo);

        const clickHandler = function (mouseEvent) {
                searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        var detailAddr = result[0].address.address_name

                        var parts = detailAddr.split(' ');
                        var city = parts[0]
                        var region = parts[1]
                        var dong = parts[2]

                        if(city === '서울'){
                            city = '서울특별시'
                        }else if(city === '대전'){
                            city = '대전광역시'
                        }else if(city === '인천'){
                            city = '인천광역시'
                        }else if(city === '광주'){
                            city = '광주광역시'
                        }else if(city === '대구'){
                            city = '대구광역시'
                        }else if(city === '울산'){
                            city = '울산광역시'
                        }else if(city === '부산'){
                            city = '부산광역시'
                        }else if(city === '경기'){
                            city = '경기도'
                        }else if(city === '충북'){
                            city = '충청북도'
                        }else if(city === '충남'){
                            city = '충청남도'
                        }else if(city === '전북'){
                            city = '전라북도'
                        }else if(city === '전남'){
                            city = '전라남도'
                        }else if(city === '경북'){
                            city = '경상북도'
                        }else if(city === '경남'){
                            city = '경상남도'
                        }

                        if(region === '어진동' || region === '다정동' || region === '나성동' || region === '가람동' || region === '반곡동' || region === '대평동' || region === '보람동' || region === '소담동' || region === '고운동' || region === '종촌동' || region === '아름동' || region === '도담동' || region === '새롬동' || region === '한솔동' || region === '소정면' || region === '전동면' || region === '전의면' || region === '연서면' || region === '장군면' || region === '금남면' || region === '부강면' || region === '연동면' || region === '연기면'){
                            region = '세종특별자치시'
                        }

                        if (customOverlay) {
                            customOverlay.setMap(null)
                        }
                        customOverlay = new kakao.maps.CustomOverlay({
                            position: mouseEvent.latLng,
                            content: iwContent,
                        });

                        customOverlay.setMap(map);
                        marker.setPosition(mouseEvent.latLng);
                        marker.setMap(map);

                        kakao.maps.event.removeListener(map, 'click', clickHandler);

                        const data = {
                            clickLatLng: mouseEvent.latLng,
                            cityValue: city,
                            regionValue: region,
                            dongValue: dong,
                        };
                        receiveData = data
                    }
                });
        };
        kakao.maps.event.addListener(map, 'click', clickHandler)
        
        
        function handleClick(event){
            if (event.target.classList.contains('travelRecord')) {
                window.ReactNativeWebView.postMessage(JSON.stringify(receiveData))  // 리액트에서 RN으로 값 전송
            } else if(event.target.classList.contains('closeMarker')){
                if (marker) {
                    marker.setMap(null)
                }
                if (customOverlay) {
                    customOverlay.setMap(null)
                }
                kakao.maps.event.addListener(map, 'click', clickHandler)
            }
        }
        
        document.addEventListener('click', handleClick)
        kakao.maps.event.addListener(map, 'click', clickHandler);

        kakao.maps.event.addListener(map, 'idle', function () {
            searchAddrFromCoords(map.getCenter(), displayCenterInfo);
        });
        function searchAddrFromCoords(coords, callback) {
            // 좌표로 행정동 주소 정보를 요청합니다
            geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
        }
        function searchDetailAddrFromCoords(coords, callback) {
            // 좌표로 법정동 상세 주소 정보를 요청합니다
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        }
        function displayCenterInfo(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                var infoDiv = document.getElementById('centerAddr');

                for (var i = 0; i < result.length; i++) {
                    // 행정동의 region_type 값은 'H' 이므로
                    if (result[i].region_type === 'H') {
                        infoDiv.innerHTML = result[i].address_name;
                        break;
                    }
                }
            }
        }

        document.addEventListener('message', (e) => {   // RN에서 값을 전송받는 부분
            const data = JSON.parse(e.data);
            setLatitude(data.latitude);
            setLongitude(data.longitude);
            setUserUID(data.userUID)
        });
        
        const fetchData = async () => {
            try{
                if(userUID){
                    const userMapDataRef = collection(fireStore, "UserData", userUID, "MapData")
                    const querySnapshot = await getDocs(userMapDataRef)

                    const data = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))

                    setMapData(data)

                    data.forEach(item => {      // 파이어베이스에서 가져온 값들로 마커 생성
                        const markerPosition = new kakao.maps.LatLng(item.receiveLatitude, item.receiveLongitude)
        
                        const marker = new kakao.maps.Marker({
                            position: markerPosition,
                            image: markerImage
                        })
        
                        marker.setMap(map)
        
                        kakao.maps.event.addListener(marker, 'click', function(){
                            alert(item.id)
                        })
                    })
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchData()
        
        return () => {  // 컴포넌트 언마운트 시 이벤트 핸들러 제거
            document.removeEventListener('click', handleClick)
        }
    }, [latitude, longitude]);

    return (
        <>
            <div className="map">
                <div className="map_container">
                    <div className="map_area">
                        <div id="map"></div>
                        <div className="hAddr">
                            <span className="regionTitle">지도중심기준 주소정보</span>
                            <span id="centerAddr"></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Map;
