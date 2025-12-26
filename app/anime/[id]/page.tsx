import { animeClient } from '@/api/animeClient';
import AnimeDetailView from '@/components/ui/AnimeDetailView';

export default async function AnimeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const anime = await animeClient.getAnimeById(id);

  if (!anime) {
    return (
        <div className="flex items-center justify-center h-full">
            <h1 className="text-3xl font-display text-wall-dark">Record Not Found</h1>
        </div>
    )
  }

  return <AnimeDetailView anime={anime} />;
}
