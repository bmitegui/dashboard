import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';

interface CurrentWeatherProps {
  temperature: string;
  description: string;
  windSpeed: string;
  humidity: string;
  icon: string;
}

export default function CurrentWeather({
  temperature,
  description,
  windSpeed,
  humidity,
  icon,
}: CurrentWeatherProps) {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={`https://openweathermap.org/img/wn/${icon}.png`}
          alt={description}
          style={{ width: 50, height: 50, marginRight: 16 }}
        />
        <Typography variant="h4" color="text.primary" fontWeight="bold">
          {temperature}°C
        </Typography>
      </Box>
      <Typography color="text.secondary">{description}</Typography>
      <Typography color="text.secondary">Wind: {windSpeed} m/s</Typography>
      <Typography color="text.secondary">Humidity: {humidity}%</Typography>
    </Paper>
  );
}
