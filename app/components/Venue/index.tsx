import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { GoogleMap } from '@react-google-maps/api';
import * as React from 'react';
import { useState } from 'react';

import { Expando } from '../Expando';
import { ResponsiveContainer } from '../ResponsiveContainer';
import { poi } from './pointsOfInterest';

const useGetMapStyles = (): React.CSSProperties => {
  const isSmallScreen = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));
  return { width: '100%', height: isSmallScreen ? '75vh' : 800 };
};

const useButtonStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export const Venue = () => {
  const [map, setMap] = useState<google.maps.Map>();

  const [poiCopy, setPoiCopy] = useState<string | JSX.Element>();
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 47.60664967809876,
    lng: -122.3316322556175,
  });

  const isSmallScreen = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const buttonClasses = useButtonStyles();

  const poiButtons = (
    <>
      {Object.entries(poi).map(
        ([key, { position, mapTypeId, zoom, heading, label, description }]) => (
          <Button
            key={key}
            classes={buttonClasses}
            variant="contained"
            fullWidth={isSmallScreen}
            onClick={() => {
              setPoiCopy(description);
              // this is a hack to fix the map remounting whenever the dom refreshes
              setCenter(position);
              if (map != null) {
                map.panTo(position);
                map.setMapTypeId(mapTypeId || 'roadmap');

                // becuase of mobile dimensions, zoom looks funky on smaller screens
                zoom && map.setZoom(isSmallScreen ? zoom * 0.95 : zoom);
                heading && map.setHeading(heading);
              }
            }}
          >
            {label}
          </Button>
        ),
      )}
    </>
  );

  return (
    <ResponsiveContainer maxWidth="md">
      <Box mb={9}>
        <Hidden mdUp>
          <Expando collapsedHeight={80}>
            <Box display="flex" width="100%" justifyContent="space-between" flexWrap="wrap" mb={2}>
              {poiButtons}
            </Box>
          </Expando>
        </Hidden>
        <Hidden smDown>
          <Box display="flex" width="100%" justifyContent="space-between">
            {poiButtons}
          </Box>
        </Hidden>
        {poiCopy != null &&
          (typeof poiCopy === 'string' ? <Typography gutterBottom>{poiCopy}</Typography> : poiCopy)}
        <GoogleMap
          onLoad={setMap}
          zoom={13}
          mapContainerStyle={useGetMapStyles()}
          center={center}
        />
      </Box>
    </ResponsiveContainer>
  );
};
