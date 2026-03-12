import type { Design } from "@/types";

export type ArtworkStatus = "IN_PROGRESS" | "COMPLETED";

export interface Artwork {
  id: string;
  userId: string;
  designId: number;
  imageUrl: string | null;
  progress: number;
  status: ArtworkStatus;
  rootArtworkId: string | null;
  createdAt: string;
  updatedAt: string;
  design: Pick<Design, "id" | "title" | "imageUrl">;
}

export interface UnlockedTheme {
  id: number;
  name: string;
  imageUrl: string;
}

export interface ArtworkResponse {
  success: boolean;
  data: Artwork;
}

export interface ArtworkCompleteResponse {
  success: boolean;
  data: Artwork & {
    unlockedTheme: UnlockedTheme | null;
    replacedRoot: boolean;
    updatedFeatured: boolean;
  };
}

export interface ArtworkListResponse {
  success: boolean;
  data: Artwork[];
}

export interface ArtworkDeleteResponse {
  success: boolean;
  data: null;
}
