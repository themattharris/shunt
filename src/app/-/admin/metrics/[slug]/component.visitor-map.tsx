'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useState, useEffect } from 'react';
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { toast } from 'sonner';
import { feature } from 'topojson-client';

export function VisitorMap({
  data,
  selectedCountry,
  selectedRegion,
  onSelectCountry,
}: {
  data: Record<string, number>;
  selectedCountry?: string | null;
  selectedRegion?: string | null;
  onSelectCountry?: (iso: string) => void;
}) {
  const [tooltipContent, setTooltipContent] = useState('');
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [geoFeatures, setGeoFeatures] = useState<FeatureCollection<
    Geometry,
    GeoJsonProperties
  > | null>(null);

  const totalCount = Object.values(data).reduce((a, b) => a + b, 0);

  const getFill = (count: number) =>
    count > 0
      ? `rgba(0, 0, 0, ${Math.min(0.8, count / 10)})`
      : 'rgba(0,0,0,0.1)';

  useEffect(() => {
    const load = async () => {
      const previousFeatures = geoFeatures;
      try {
        const url =
          selectedRegion && selectedCountry?.toUpperCase() === 'US'
            ? `https://code.highcharts.com/mapdata/countries/us/us-${selectedRegion.toLowerCase()}-all.topo.json`
            : selectedCountry
              ? `https://code.highcharts.com/mapdata/countries/${selectedCountry.toLowerCase()}/${selectedCountry.toLowerCase()}-all.topo.json`
              : 'https://code.highcharts.com/mapdata/custom/world.topo.json';
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Fetch failed with status ${res.status}`);
        }
        const topoJson = await res.json();
        const objectKey = Object.keys(topoJson.objects)[0];
        const geoJson = feature(
          topoJson,
          topoJson.objects[objectKey]
        ) as unknown;
        if (
          geoJson &&
          typeof geoJson === 'object' &&
          (geoJson as FeatureCollection).type === 'FeatureCollection' &&
          'features' in geoJson &&
          Array.isArray((geoJson as FeatureCollection).features)
        ) {
          setGeoFeatures(
            geoJson as FeatureCollection<Geometry, GeoJsonProperties>
          );
        } else {
          throw new Error('Invalid geojson structure');
        }
        console.log('Loaded geo data:', url);
        console.log('Geo data:', geoJson);
        console.log('data:', data);
        console.log('selectedCountry:', selectedCountry);
        console.log('selectedRegion:', selectedRegion);
        console.log('geoFeatures:', geoFeatures);
      } catch (err) {
        console.error('Error loading geo data:', err);
        setGeoFeatures(previousFeatures ?? null);
        toast.error('Unable to load region map – reverting to previous view.');
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry, selectedRegion, data]);

  return (
    <div className="w-full h-96 border rounded overflow-hidden">
      <ComposableMap projection="geoEqualEarth" width={800} height={420}>
        <Geographies
          geography={{
            type: 'FeatureCollection',
            features: geoFeatures ?? [],
          }}
        >
          {({ geographies }) =>
            geographies.map(geo => {
              const iso =
                geo.properties?.['iso-a2'] ??
                geo.properties?.['hc-key'] ??
                geo.properties?.['Alpha-2'] ??
                '';
              const name = geo.properties?.['name'] ?? iso;
              const count = data[iso] || data[name] || 0;
              const fill = getFill(count);
              const percent =
                totalCount > 0
                  ? ((count / totalCount) * 100).toFixed(1)
                  : '0.0';

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={e => {
                    const { clientX, clientY } = e;
                    setMousePosition({ x: clientX, y: clientY });
                    setTooltipContent(
                      `${name}: ${count} visit${count === 1 ? '' : 's'} (${percent}%)`
                    );
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('');
                    setMousePosition(null);
                  }}
                  onClick={() => {
                    if (!selectedCountry && onSelectCountry) {
                      onSelectCountry(iso);
                    }
                  }}
                  style={{
                    default: {
                      fill,
                      outline: 'none',
                      stroke: 'rgba(0,0,0,0.2)',
                      strokeWidth: 0.5,
                    },
                    hover: {
                      fill: fill.replace(
                        /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
                        'rgba($1,$2,$3,1)'
                      ),
                      outline: 'none',
                      stroke: 'rgba(0,0,0,0.2)',
                      strokeWidth: 1,
                    },
                    pressed: {
                      fill: fill.replace(
                        /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
                        'rgba($1,$2,$3,1)'
                      ),
                      outline: 'none',
                      stroke: 'rgba(0,0,0,0.2)',
                      strokeWidth: 1,
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {tooltipContent && mousePosition && (
        <div
          style={{
            position: 'fixed',
            top: mousePosition.y + 12,
            left: mousePosition.x + 12,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '6px 10px',
            pointerEvents: 'none',
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            fontSize: '0.875rem',
            color: '#333',
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}
