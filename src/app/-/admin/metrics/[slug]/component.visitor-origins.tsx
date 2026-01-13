'use client';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import { Suspense } from 'react';
import { VisitorMap } from '@/app/-/admin/metrics/[slug]/component.visitor-map';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type VisitorOriginProps = {
  className?: string;
  visitsByRange: Record<
    string,
    { city?: string | null; region?: string | null; country?: string | null }[]
  >;
  initialRange?: string;
};

export default function VisitorOrigins({
  className,
  visitsByRange,
  initialRange = '30d',
}: VisitorOriginProps) {
  const [selectedRange] = useState(initialRange);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleCountryClick = useCallback((country: string) => {
    setSelectedCountry(country);
    setSelectedRegion(null);
  }, []);

  const countryCounts: Record<
    string,
    Record<string, number>
  > = Object.fromEntries(
    Object.entries(visitsByRange).map(([range, visits]) => {
      const counts: Record<string, number> = {};
      visits.forEach(v => {
        const country = v.country ?? 'Unknown';
        counts[country] = (counts[country] || 0) + 1;
      });
      return [range, counts];
    })
  );

  const currentCountryCounts = countryCounts[selectedRange] ?? {};

  return (
    <div className={cn('flex flex-row gap-4', className)}>
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Loading map…</div>
        }
      >
        <Card className="basis-7/8">
          <CardHeader>
            <div className="flex gap-4">
              <CardTitle className="text-lg font-semibold">
                Visitor Map
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <VisitorMap
              data={currentCountryCounts}
              selectedCountry={selectedCountry}
              selectedRegion={selectedRegion}
              onSelectCountry={handleCountryClick}
            />
          </CardContent>
        </Card>
      </Suspense>

      <Card className="basis-1/8 h-full">
        <CardHeader>
          <div className="flex gap-4">
            <CardTitle className="text-lg font-semibold">
              Visitor Origins
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between mb-2 border-b">
            <span>
              World
              {selectedCountry && ` → ${selectedCountry}`}
              {selectedRegion && ` → ${selectedRegion}`}
            </span>
          </div>
          {(() => {
            const geoData: Record<
              string,
              Record<string, Record<string, number>>
            > = {};
            (visitsByRange[selectedRange] ?? []).forEach(visit => {
              const country = visit.country ?? 'Unknown';
              const region = visit.region ?? 'Unknown';
              const city = visit.city ?? 'Unknown';

              geoData[country] ??= {};
              geoData[country][region] ??= {};
              geoData[country][region][city] =
                (geoData[country][region][city] || 0) + 1;
            });

            let view:
              | Record<string, number>
              | Record<string, Record<string, number>>
              | Record<string, Record<string, Record<string, number>>> =
              geoData;
            if (selectedCountry) {
              view = geoData[selectedCountry];
              if (selectedRegion && typeof view === 'object') {
                view = view[selectedRegion];
              }
            }

            return typeof view === 'object'
              ? Object.entries(view).map(([key, val]) => {
                  const totalCount =
                    typeof val === 'number'
                      ? val
                      : Object.values(val).reduce<number>(
                          (sum, v) => (typeof v === 'number' ? sum + v : sum),
                          0
                        );

                  return (
                    <div
                      key={key}
                      className="flex justify-between items-center cursor-pointer hover:text-foreground"
                      onClick={() => {
                        if (!selectedCountry) setSelectedCountry(key);
                        else if (!selectedRegion) setSelectedRegion(key);
                      }}
                    >
                      <span>{key}</span>
                      <span>{String(totalCount)}</span>
                    </div>
                  );
                })
              : null;
          })()}
        </CardContent>
        <CardFooter>
          {(selectedCountry || selectedRegion) && (
            <Button
              variant="link"
              size="sm"
              className="px-0"
              onClick={() => {
                if (selectedRegion) setSelectedRegion(null);
                else setSelectedCountry(null);
              }}
            >
              ← Back
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
