import { animeClient } from '@/api/animeClient';
import AnimeGrid from '@/components/ui/AnimeGrid';

export const revalidate = 60;

export default async function TopRatedPage() {
  const data = await animeClient.getTopRated();
  
  if (!data || data.length === 0) {
      return (
          <div className="flex items-center justify-center h-screen flex-col gap-4 text-center p-4">
              <h2 className="text-3xl font-display text-wall-dark font-bold">Service Elevator Out of Order</h2>
              <p className="font-sans text-gray-800">Unable to retrieve top rated data.</p>
          </div>
      )
  }

  return <AnimeGrid items={data} title="Top Rated Classics" />;
}
