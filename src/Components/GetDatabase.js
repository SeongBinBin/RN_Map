import React, { useEffect, useState } from "react";
import { fireStore } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";

function GetDatabase() {
    const [mapData, setMapData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(fireStore, "MapData"));

            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setMapData(data);
        };

        fetchData();
    }, []);

    console.log(mapData)

    return (
        <div>
            {mapData.map((item, index) => (
                <div key={item.id}>
                    {/* 필요한 속성에 따라 데이터 표시 */}
                    <p>제목 : {JSON.stringify(item.title)}</p>
                    <p>내용 : {JSON.stringify(item.mainText)}</p>
                    <p>지역 : {JSON.stringify(item.receiveCityValue)}</p>
                    <p>구역 : {JSON.stringify(item.receiveRegionValue)}</p>
                    <p>위도 : {JSON.stringify(item.receiveLatitude)}</p>
                    <p>경도 : {JSON.stringify(item.receiveLongitude)}</p>
                    <p>----------------------------------------</p>
                </div>
            ))}
            {/* {fireStore._databaseId.projectId} */}
        </div>
    );
}

export default GetDatabase;
