import './App.css';
import Grid from '@mui/material/Grid';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import LineChartWeather from './components/LineChartWeather';
import ControlWeather from './components/ControlWeather';
import Item from './interface/Item';

import { useEffect, useState } from 'react';

interface Indicator {
  title?: string;
  subtitle?: string;
  value?: string;
}

function App() {

  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [charts, setCharts] = useState<Item[]>([]);
  const [selectedVariable, setSelectedVariable] = useState<string>("humidity");

  useEffect(() => {
    const request = async () => {
      const API_KEY = "1a9d1fde1fc9b6de311b76cabecdc55c";
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
      const savedTextXML = await response.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      let dataToIndicators: Indicator[] = [];

      let name = xml.getElementsByTagName("name")[0].innerHTML || "";
      dataToIndicators.push({ title: "Location", subtitle: "City", value: name });

      let location = xml.getElementsByTagName("location")[1];
      let latitude = location.getAttribute("latitude") || "";
      dataToIndicators.push({ title: "Location", subtitle: "Latitude", value: latitude });

      let longitude = location.getAttribute("longitude") || "";
      dataToIndicators.push({ title: "Location", subtitle: "Longitude", value: longitude });

      let altitude = location.getAttribute("altitude") || "";
      dataToIndicators.push({ title: "Location", subtitle: "Altitude", value: altitude });

      setIndicators(dataToIndicators);

      let dataToItems = new Array<Item>();
      let time = xml.getElementsByTagName("time");

      for (let i = 0; i < time.length && i < 10; i++) {
        const times = time[i];
        const from = times.getAttribute('from');
        const to = times.getAttribute('to');
        const precip = times.getElementsByTagName('precipitation')[0]?.getAttribute('probability') || '0';
        const temp = times.getElementsByTagName('temperature')[0]?.getAttribute('value') || '0';
        const hum = times.getElementsByTagName('humidity')[0]?.getAttribute('value') || '0';
        const cloud = times.getElementsByTagName('clouds')[0]?.getAttribute('value') || '0';

        const valorPrec = Number(precip) * 100;
        const precipit = valorPrec.toString() || '0';
        const temperatura = ((Number(temp) - 273.15).toFixed(2)).toString();

        dataToItems.push({
          dateStart: from || "",
          dateEnd: to || "",
          precipitation: precipit || "",
          temperatura: temperatura || "",
          humidity: hum || "",
          clouds: cloud || ""
        });
      }

      setItems(dataToItems);

      let chartsToItem = new Array<Item>();

      for (let i = 0; i < time.length && i < 10; i++) {
        const times = time[i];
        const from = times.getAttribute('from');
        const to = times.getAttribute('to');
        const precip = times.getElementsByTagName('precipitation')[0]?.getAttribute('probability') || '0';
        const temp = times.getElementsByTagName('temperature')[0]?.getAttribute('value') || '0';
        const hum = times.getElementsByTagName('humidity')[0]?.getAttribute('value') || '0';
        const cloud = times.getElementsByTagName('clouds')[0]?.getAttribute('all') || '0';

        const valorPrec = Number(precip) * 100;
        const precipit = valorPrec.toString() || '0';
        const temperatura = ((Number(temp) - 273.15).toFixed(2)).toString();

        chartsToItem.push({
          dateStart: from || "",
          dateEnd: to || "",
          precipitation: precipit || "",
          temperatura: temperatura || "",
          humidity: hum || "",
          clouds: cloud || ""
        });
      }

      setCharts(chartsToItem);
    }

    request();
  }, []);

  const renderIndicators = () => {
    return indicators.map((indicator, idx) => (
      <Grid key={idx} item xs={12} xl={3}>
        <IndicatorWeather title={indicator.title} subtitle={indicator.subtitle} value={indicator.value} />
      </Grid>
    ));
  }

  return (
    <Grid container spacing={5}>
      {renderIndicators()}

      <Grid item xs={12}>
        <TableWeather itemsIn={items} />
      </Grid>

      <Grid item xs={12}>
        <h2>Variables Meteorológicas y Gráfico</h2>
        <p className="description">
          Visualización gráfica de las variables meteorológicas seleccionadas a lo largo del tiempo. Seleccione una variable para ver su comportamiento.
        </p>
        <Grid container spacing={2} className="chart-container">
          <Grid item xs={12} md={4}>
            <ControlWeather
              selectedVariable={selectedVariable}
              onVariableChange={setSelectedVariable}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <LineChartWeather data={items} variable={selectedVariable} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
