import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_KEY = import.meta.env.VITE_RESAS_API_KEY;

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PopulationData {
  year: number;
  value: number;
  rate?: number;
}

interface PopulationDataByLabel {
  [label: string]: PopulationData[];
}

interface PopulationDataByCode {
  [code: number]: PopulationDataByLabel;
}

const PopulationPage: React.FC = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [populationData, setPopulationData] = useState<PopulationDataByCode>(
    {}
  );

  const [populationType, setPopulationType] = useState<string>("総人口");

  useEffect(() => {
    // Fetch prefectures data from RESAS API
    axios
      .get("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
        headers: { "X-API-KEY": API_KEY },
      })
      .then((response) => {
        // log.info(response);
        // console.log(response);
        setPrefectures(response.data.result);
      })
      .catch((error) => {
        console.error("Error fetching prefectures:", error);
      });
  }, []);

  const handlePrefectureChange = (prefCode: number) => {
    const selectedIndex = selectedPrefectures.indexOf(prefCode);
    let newSelectedPrefectures: number[] = [];

    if (selectedIndex === -1) {
      // Prefecture is being selected
      newSelectedPrefectures = [...selectedPrefectures, prefCode];
    } else {
      // Prefecture is being deselected
      newSelectedPrefectures = selectedPrefectures.filter(
        (code) => code !== prefCode
      );
    }

    setSelectedPrefectures(newSelectedPrefectures);

    // Fetch population data for selected prefectures
    newSelectedPrefectures.forEach((code) => {
      // console.log(code);
      if (!populationData[code]) {
        axios
          .get(
            `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${code}`,
            {
              headers: { "X-API-KEY": API_KEY },
            }
          )
          .then((response) => {
            // Extract the population data from the response
            const populationDataByLabel: PopulationDataByLabel = {};

            response.data.result.data.forEach(
              (item: { label: string; data: PopulationData[] }) => {
                populationDataByLabel[item.label] = item.data.map(
                  (dataItem) => ({
                    year: dataItem.year,
                    value: dataItem.value,
                    rate: dataItem.rate ?? 0,
                  })
                );
              }
            );

            // Update the population data state by merging the previous data with the new data
            // console.log(
            //   "populationDataByLabel:" + JSON.stringify(populationDataByLabel)
            // );

            setPopulationData((prevData) => ({
              ...prevData,
              [code]: populationDataByLabel,
            }));
          })
          .catch((error) => {
            console.error(
              `Error fetching population data for prefecture ${code}:`,
              error
            );
          });
      }
    });
  };

  const renderLineChart = () => {
    const data = selectedPrefectures
      .map((code) => {
        const prefecture = prefectures.find((pref) => pref.prefCode === code);
        const prefectureData = populationData[code]?.[populationType];

        if (prefecture && prefectureData) {
          return {
            name: prefecture.prefName,
            data: prefectureData,
          };
        }

        return null;
      })
      .filter((item) => item !== null);

    // Find the minimum and maximum years among all selected prefectures
    const minYear = Math.min(
      ...data.map((prefecture) =>
        Math.min(...prefecture!.data.map((item) => item.year))
      )
    );
    const maxYear = Math.max(
      ...data.map((prefecture) =>
        Math.max(...prefecture!.data.map((item) => item.year))
      )
    );

    // Generate an array of all years from minYear to maxYear
    const years = Array.from(
      { length: maxYear - minYear + 1 },
      (_, index) => minYear + index
    );

    // Create a new data array with consistent year values for all prefectures
    const chartData = years.map((year) => {
      const yearData: { [key: string]: number | undefined } = { year };
      data.forEach((prefecture) => {
        const populationValue = prefecture!.data.find(
          (item) => item.year === year
        )?.value;
        yearData[prefecture!.name] = populationValue;
      });
      return yearData;
    });

    const colors = selectedPrefectures.map((prefCode) => {
      const hue = (prefCode * 137.508) % 360; // Generate a unique hue for each prefecture
      return `hsl(${hue}, 50%, 50%)`;
    });

    return (
      <LineChart
        width={1200}
        height={500}
        data={chartData}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <XAxis
          dataKey="year"
          label={{ value: "Year", position: "insideBottomRight", offset: -10 }}
        />
        <YAxis
          label={{
            value: "Population",
            angle: -90,
            position: "insideLeft",
            offset: -10,
          }}
          tickFormatter={(value) =>
            Intl.NumberFormat("en", { notation: "compact" }).format(value)
          }
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        {data.map((prefecture, index) => (
          <Line
            key={prefecture!.name}
            type="monotone"
            dataKey={prefecture!.name}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            animationDuration={800}
            connectNulls
          />
        ))}
      </LineChart>
    );
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>都道府県別人口推移</h1>
      <div>
        <h2>都道府県選択</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {prefectures.map((prefecture) => (
            <label key={prefecture.prefCode} style={{ margin: "0.35rem" }}>
              <input
                type="checkbox"
                checked={selectedPrefectures.includes(prefecture.prefCode)}
                onChange={() => handlePrefectureChange(prefecture.prefCode)}
              />
              {prefecture.prefName}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h2>人口構成グラフ</h2>
        <select
          value={populationType}
          onChange={(e) => setPopulationType(e.target.value)}
          style={{ margin: "1rem 0", fontSize: "1.2rem" }}
        >
          <option value="総人口">総人口</option>
          <option value="年少人口">年少人口</option>
          <option value="生産年齢人口">生産年齢人口</option>
          <option value="老年人口">老年人口</option>
        </select>
        <div style={{ width: "100%", height: "450px" }}>
          <ResponsiveContainer>{renderLineChart()}</ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PopulationPage;
